const Task = require('../../models/Task');
const { connectDB } = require('../../utils/db');
const { notFound } = require('./helpers');

/**
 * GET /api/tasks
 * Returns all tasks, optionally filtered by status or search query.
 */
async function getAllTasks(req, res) {
  await connectDB();

  const { status, search } = req.query;
  const filter = {};

  if (status === 'active')     filter.completed = false;
  if (status === 'completed')  filter.completed = true;

  if (search?.trim()) {
    filter.title = { $regex: search.trim(), $options: 'i' };
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
}

/**
 * GET /api/tasks/:id
 * Returns a single task by ID.
 */
async function getTaskById(req, res) {
  await connectDB();

  const task = await Task.findById(req.params.id);
  if (!task) return notFound(res);

  res.json(task);
}

module.exports = { getAllTasks, getTaskById };
