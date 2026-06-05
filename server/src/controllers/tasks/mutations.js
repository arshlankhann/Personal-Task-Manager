const Task = require('../../models/Task');
const { connectDB } = require('../../utils/db');
const { notFound } = require('./helpers');

/**
 * POST /api/tasks
 * Creates a new task.
 * Body: { title (required), description?, dueDate? }
 */
async function createTask(req, res) {
  await connectDB();

  const { title, description, dueDate } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = await Task.create({
    title:       title.trim(),
    description: description?.trim() ?? '',
    dueDate:     dueDate ?? null,
    order:       Date.now(),
  });

  res.status(201).json(task);
}

/**
 * PUT /api/tasks/:id
 * Updates an existing task's fields.
 * Body: { title?, description?, dueDate?, completed?, order? }
 */
async function updateTask(req, res) {
  await connectDB();

  const { title, description, dueDate, completed, order } = req.body;

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  const updates = {};
  if (title !== undefined)       updates.title       = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (dueDate !== undefined)     updates.dueDate     = dueDate ?? null;
  if (completed !== undefined)   updates.completed   = Boolean(completed);
  if (order !== undefined)       updates.order       = order;

  const task = await Task.findByIdAndUpdate(req.params.id, updates, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!task) return notFound(res);
  res.json(task);
}

/**
 * DELETE /api/tasks/:id
 * Permanently deletes a task.
 */
async function deleteTask(req, res) {
  await connectDB();

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return notFound(res);

  res.json({ message: 'Task deleted successfully' });
}

module.exports = { createTask, updateTask, deleteTask };
