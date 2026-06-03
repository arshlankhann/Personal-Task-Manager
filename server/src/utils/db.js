const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'tasks.json');

/**
 * Ensures the data directory and tasks file exist.
 */
function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Read all tasks from the JSON file.
 * @returns {Array} Array of task objects
 */
function readTasks() {
  ensureDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Write tasks array to the JSON file.
 * @param {Array} tasks
 */
function writeTasks(tasks) {
  ensureDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

module.exports = { readTasks, writeTasks };
