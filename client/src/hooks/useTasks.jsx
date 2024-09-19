import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const createTask = async (task) => {
    try {
      const response = await api.post('/tasks', task);
      setTasks([...tasks, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await api.put(`/tasks/${task._id}`, task);
      setTasks(tasks.map(t => t._id === task._id ? response.data : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask };
};