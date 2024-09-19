const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Admin and Manager only)
router.post('/', protect, authorize('admin', 'manager'), createTask);

// @route   GET /api/tasks
// @desc    Get all tasks (filtered based on user role)
// @access  Private
router.get('/', protect, getTasks);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private (with role-based restrictions)
router.put('/:id', protect, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Admin and Manager only)
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTask);

module.exports = router;
