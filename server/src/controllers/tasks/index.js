// Central re-export — routes sirf yahan se import karte hain
const { getAllTasks } = require('./queries');
const { createTask, updateTask, deleteTask } = require('./mutations');
const { toggleTask, reorderTasks } = require('./actions');

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
};
