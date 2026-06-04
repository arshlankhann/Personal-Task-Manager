const Task = require('../models/Task');
const { connectDB } = require('../utils/db');

/**
 * GET /api/tasks
 * Returns all tasks. Supports optional ?status=active|completed&search=<query> filters.
 */
async function getAllTasks(req, res) {
  try {
    await connectDB();
    const { status, search } = req.query;

    const filter = {};
    if (status === 'active') filter.completed = false;
    else if (status === 'completed') filter.completed = true;

    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

/**
 * GET /api/tasks/:id
 * Returns a single task by ID.
 */
async function getTaskById(req, res) {
  try {
    await connectDB();
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
}

/**
 * POST /api/tasks
 * Creates a new task.
 * Body: { title (required), description?, dueDate?, priority? }
 */
async function createTask(req, res) {
  try {
    await connectDB();
    const { title, description, dueDate, priority } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      order: Date.now(),
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

/**
 * PUT /api/tasks/:id
 * Updates an existing task.
 */
async function updateTask(req, res) {
  try {
    await connectDB();
    const { title, description, dueDate, completed, order, priority } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (dueDate !== undefined) updates.dueDate = dueDate || null;
    if (completed !== undefined) updates.completed = Boolean(completed);
    if (order !== undefined) updates.order = order;
    if (priority !== undefined) updates.priority = priority;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

/**
 * DELETE /api/tasks/:id
 * Deletes a task by ID.
 */
async function deleteTask(req, res) {
  try {
    await connectDB();
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}

/**
 * PATCH /api/tasks/:id/toggle
 * Toggles a task's completed status.
 */
async function toggleTask(req, res) {
  try {
    await connectDB();
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
}

/**
 * PATCH /api/tasks/reorder
 * Accepts an array of ordered IDs to bulk-update task order for drag-and-drop.
 */
async function reorderTasks(req, res) {
  try {
    await connectDB();
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        Task.findByIdAndUpdate(id, { order: index })
      )
    );

    res.json({ message: 'Tasks reordered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
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
