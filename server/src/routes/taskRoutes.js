const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
} = require('../controllers/tasks');

// Reorder (must be before /:id routes)
router.patch('/reorder', reorderTasks);

// Standard CRUD
router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Toggle complete/incomplete
router.patch('/:id/toggle', toggleTask);

module.exports = router;
