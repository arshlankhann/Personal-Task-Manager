// Shared response helpers used across all task controllers

const notFound   = (res) => res.status(404).json({ error: 'Task not found' });
const badRequest = (res, message) => res.status(400).json({ error: message });

module.exports = { notFound, badRequest };
