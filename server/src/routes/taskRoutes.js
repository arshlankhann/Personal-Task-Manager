const express = require('express');
const router = express.Router();
const { getAllTasks, getTaskById} = require('../controllers/tasks/queries');
const { createTask, updateTask, deleteTask } = require('../controllers/tasks/mutations');
const { toggleComplete, reorderTasks } = require('../controllers/tasks/actions');

// Reorder 
router.patch('/reorder', reorderTasks);

router.get('/', getAllTasks)
router.get('/:id', getTaskById)
router.post('/', createTask)
router.put("/:id", updateTask)
router.delete('/:id', deleteTask)

//Toggle complete
router.patch('/:id/toggle', toggleComplete)

module.exports = router;