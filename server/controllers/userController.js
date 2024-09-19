const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view all users' });
        }

        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.user.role === 'manager' && user.team.toString() !== req.user.team.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this user' });
        }
        if (req.user.role === 'employee' && user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this user' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.user.role !== 'admin' &&
            (req.user.role === 'manager' && user.team.toString() !== req.user.team.toString()) ||
            (req.user.role === 'employee' && user._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        if (req.body.role && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to change user role' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete users' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};