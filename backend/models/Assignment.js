const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an assignment title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true,
      maxlength: [60, 'Subject cannot exceed 60 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    dueDate: {
      type: Date,
      required: [true, 'Please specify a due date for the assignment']
    },
    priority: {
      type: String,
      enum: {
        values: ['High', 'Medium', 'Low'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'Medium'
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Pending'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying a student's assignments efficiently
assignmentSchema.index({ userId: 1, dueDate: 1 });
assignmentSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);

