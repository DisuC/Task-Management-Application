import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import api from '../utils/api';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch tasks. Please try again.');
            setLoading(false);
        }
    };

    const handleAddTask = async (task) => {
        try {
            const response = await api.post('/tasks', task);
            setTasks([...tasks, response.data]);
            setIsAddingTask(false);
        } catch (error) {
            setError('Failed to add task. Please try again.');
        }
    };

    const handleUpdateTask = async (task) => {
        try {
            const response = await api.put(`/tasks/${task._id}`, task);
            setTasks(tasks.map(t => t._id === task._id ? response.data : t));
            setEditingTask(null);
        } catch (error) {
            setError('Failed to update task. Please try again.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(t => t._id !== taskId));
        } catch (error) {
            setError('Failed to delete task. Please try again.');
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Dashboard</h1>
            <div className="mb-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddingTask(true)}
                    className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
                >
                    Create Task
                </motion.button>
            </div>
            {isAddingTask && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New Task</h2>
                    <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddingTask(false)} />
                </div>
            )}
            {editingTask && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Edit Task</h2>
                    <TaskForm onSubmit={handleUpdateTask} initialData={editingTask} onCancel={() => setEditingTask(null)} />
                </div>
            )}
            <TaskList
                tasks={tasks}
                onUpdateTask={setEditingTask}
                onDeleteTask={handleDeleteTask}
                userRole={user.role}
            />
        </div>
    );
};

export default DashboardPage;