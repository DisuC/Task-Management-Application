const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), getUsers);

// @route   GET /api/users/:id
// @desc    Get a single user
// @access  Private (with role-based restrictions)
router.get('/:id', protect, getUser);

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Private (with role-based restrictions)
router.put('/:id', protect, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteUser);



module.exports = router;
