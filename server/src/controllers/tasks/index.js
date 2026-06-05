// Central re-export — routes sirf yahan se import karte hain
const { getAllTasks, getTaskById } = require('./queries');
const { createTask, updateTask, deleteTask } = require('./mutations');
const { toggleTask, reorderTasks } = require('./actions');

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
};
