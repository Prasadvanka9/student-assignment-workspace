const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignmentStats,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  updateAssignmentStatus
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

// All assignment routes require JWT authentication
router.use(protect);

// Specific sub-routes must come before parameterized ':id'
router.get('/stats/summary', getAssignmentStats);

router.route('/')
  .get(getAssignments)
  .post(createAssignment);

router.route('/:id')
  .get(getAssignmentById)
  .put(updateAssignment)
  .delete(deleteAssignment);

router.patch('/:id/status', updateAssignmentStatus);

module.exports = router;

