const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Not authorized to create tasks' });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            team: req.user.team
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find().populate('assignedTo assignedBy');
        } else if (req.user.role === 'manager') {
            tasks = await Task.find({ team: req.user.team }).populate('assignedTo assignedBy');
        } else {
            tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedBy');
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        if (req.user.role === 'manager' && task.team.toString() !== req.user.team.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.user.role !== 'admin' &&
            (req.user.role === 'manager' && task.team.toString() !== req.user.team.toString())) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.remove();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};