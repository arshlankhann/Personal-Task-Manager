const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
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
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Toggle complete/incomplete
router.patch('/:id/toggle', toggleTask);

module.exports = router;
