const Task = require('../../models/Task');

const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch first so we can read the current `completed` value
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    // Flip the flag and persist
    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle Task' });
  }
};



async function reorderTasks(req, res) {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array' });
  }

  await Promise.all(
    orderedIds.map((id, index) => Task.findByIdAndUpdate(id, { order: index }))
  );

  res.json({ message: 'Tasks reordered successfully' });
}

module.exports = { toggleComplete, reorderTasks };
