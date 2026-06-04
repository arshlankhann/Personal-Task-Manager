const { v4: uuidv4 } = require('uuid');
const { readTasks, writeTasks } = require('../utils/db');

/**
 * GET /api/tasks
 * Returns all tasks sorted by creation date (newest first).
 * Supports optional ?status=active|completed&search=<query> filters.
 */
function getAllTasks(req, res) {
  let tasks = readTasks();

  const { status, search } = req.query;

  if (status === 'active') {
    tasks = tasks.filter((t) => !t.completed);
  } else if (status === 'completed') {
    tasks = tasks.filter((t) => t.completed);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
  }

  // Sort by creation date, newest first
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(tasks);
}

/**
 * GET /api/tasks/:id
 * Returns a single task by ID.
 */
function getTaskById(req, res) {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
}

/**
 * POST /api/tasks
 * Creates a new task.
 * Body: { title (required), description?, dueDate? }
 */
function createTask(req, res) {
  const { title, description, dueDate, priority } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : '',
    dueDate: dueDate || null,
    priority: priority || 'medium',
    completed: false,
    order: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tasks = readTasks();
  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
}

/**
 * PUT /api/tasks/:id
 * Updates an existing task's title, description, dueDate, or completed status.
 */
function updateTask(req, res) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const { title, description, dueDate, completed, order, priority } = req.body;

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  const updated = {
    ...tasks[index],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(dueDate !== undefined && { dueDate: dueDate || null }),
    ...(completed !== undefined && { completed: Boolean(completed) }),
    ...(order !== undefined && { order }),
    ...(priority !== undefined && { priority }),
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  writeTasks(tasks);

  res.json(updated);
}

/**
 * DELETE /api/tasks/:id
 * Deletes a task by ID.
 */
function deleteTask(req, res) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks.splice(index, 1);
  writeTasks(tasks);

  res.json({ message: 'Task deleted successfully' });
}

/**
 * PATCH /api/tasks/:id/toggle
 * Toggles a task's completed status.
 */
function toggleTask(req, res) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks[index].completed = !tasks[index].completed;
  tasks[index].updatedAt = new Date().toISOString();
  writeTasks(tasks);

  res.json(tasks[index]);
}

/**
 * PATCH /api/tasks/reorder
 * Accepts an array of { id, order } to bulk-update task order for drag-and-drop.
 */
function reorderTasks(req, res) {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array' });
  }

  const tasks = readTasks();
  orderedIds.forEach((id, index) => {
    const task = tasks.find((t) => t.id === id);
    if (task) task.order = index;
  });
  writeTasks(tasks);

  res.json({ message: 'Tasks reordered successfully' });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
};
