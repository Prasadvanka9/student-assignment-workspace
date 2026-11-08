const Assignment = require('../models/Assignment');

// @desc    Get all assignments for the logged-in student with search, filter, and sort
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res, next) => {
  try {
    const { search, subject, priority, status, sort } = req.query;

    // Base query scoped strictly to the authenticated student
    const query = { userId: req.user._id };

    // Search by title or description or subject
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { subject: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by subject
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Filter by status (including virtual 'Overdue' filter)
    const now = new Date();
    if (status && status !== 'All') {
      if (status === 'Overdue') {
        query.dueDate = { $lt: now };
        query.status = { $ne: 'Completed' };
      } else {
        query.status = status;
      }
    }

    // Sorting
    let sortOptions = { dueDate: 1 }; // default: nearest deadline first
    if (sort === 'deadline-desc') {
      sortOptions = { dueDate: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'priority') {
      // Handled in JS or via custom sort if desired
    }

    let assignments = await Assignment.find(query).sort(sortOptions);

    if (sort === 'priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      assignments = assignments.sort(
        (a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
      );
    }

    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics & summary for the student
// @route   GET /api/assignments/stats/summary
// @access  Private
const getAssignmentStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const allAssignments = await Assignment.find({ userId }).sort({ dueDate: 1 });

    const total = allAssignments.length;
    let completed = 0;
    let pending = 0;
    let inProgress = 0;
    let overdue = 0;
    let dueToday = 0;

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const upcomingList = [];

    allAssignments.forEach((item) => {
      const due = new Date(item.dueDate);

      if (item.status === 'Completed') {
        completed++;
      } else {
        if (item.status === 'In Progress') {
          inProgress++;
        } else {
          pending++;
        }

        if (due < startOfToday) {
          overdue++;
        } else if (due >= startOfToday && due <= endOfToday) {
          dueToday++;
          upcomingList.push(item);
        } else {
          upcomingList.push(item);
        }
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Subjects summary
    const subjectsMap = {};
    allAssignments.forEach((item) => {
      subjectsMap[item.subject] = (subjectsMap[item.subject] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        dueToday,
        completionRate,
        upcomingDeadlines: upcomingList.slice(0, 5),
        recentAssignments: allAssignments
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
        subjectsDistribution: subjectsMap
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Ownership check
    if (assignment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this assignment'
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private
const createAssignment = async (req, res, next) => {
  try {
    const { title, subject, description, dueDate, priority, status } = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, and due date'
      });
    }

    const assignment = await Assignment.create({
      title: title.trim(),
      subject: subject.trim(),
      description: description ? description.trim() : '',
      dueDate: new Date(dueDate),
      priority: priority || 'Medium',
      status: status || 'Pending',
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: 'Assignment created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private
const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Ownership verification
    if (assignment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this assignment'
      });
    }

    const { title, subject, description, dueDate, priority, status } = req.body;

    if (title !== undefined) assignment.title = title.trim();
    if (subject !== undefined) assignment.subject = subject.trim();
    if (description !== undefined) assignment.description = description.trim();
    if (dueDate !== undefined) assignment.dueDate = new Date(dueDate);
    if (priority !== undefined) assignment.priority = priority;
    if (status !== undefined) assignment.status = status;

    const updated = await assignment.save();

    res.json({
      success: true,
      data: updated,
      message: 'Assignment updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private
const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Ownership verification
    if (assignment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this assignment'
      });
    }

    await assignment.deleteOne();

    res.json({
      success: true,
      data: {},
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment status
// @route   PATCH /api/assignments/:id/status
// @access  Private
const updateAssignmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, In Progress, or Completed'
      });
    }

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (assignment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to modify this assignment'
      });
    }

    assignment.status = status;
    const updated = await assignment.save();

    res.json({
      success: true,
      data: updated,
      message: `Assignment status updated to ${status}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignments,
  getAssignmentStats,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  updateAssignmentStatus
};

