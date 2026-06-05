const Task = require('../../models/Task');
const { connectDB } = require('../../utils/db');
const { notFound } = require('./helpers');

/**
 * PATCH /api/tasks/:id/toggle
 * Flips a task's completed status.
 */
async function toggleTask(req, res) {
  await connectDB();

  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res);

  task.completed = !task.completed;
  await task.save();

  res.json(task);
}

/**
 * PATCH /api/tasks/reorder
 * Accepts an ordered array of IDs to bulk-update task positions.
 * Body: { orderedIds: string[] }
 */
async function reorderTasks(req, res) {
  await connectDB();

  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array' });
  }

  await Promise.all(
    orderedIds.map((id, index) => Task.findByIdAndUpdate(id, { order: index }))
  );

  res.json({ message: 'Tasks reordered successfully' });
}

module.exports = { toggleTask, reorderTasks };
