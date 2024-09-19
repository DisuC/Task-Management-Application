import React from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';

const TaskItem = ({ task, onUpdateTask, onDeleteTask, userRole }) => {
  const canEdit = userRole === 'Admin' || userRole === 'Manager';
  const canDelete = userRole === 'Admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-sm ${
          task.status === 'Completed' ? 'bg-green-200 text-green-800' :
          task.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
          'bg-red-200 text-red-800'
        }`}>
          {task.status}
        </span>
        <div className="space-x-2">
          {canEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateTask(task)}
              className="p-2 bg-primary text-white rounded-md"
            >
              <PencilIcon className="h-5 w-5" />
            </motion.button>
          )}
          {canDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDeleteTask(task._id)}
              className="p-2 bg-danger text-white rounded-md"
            >
              <TrashIcon className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;