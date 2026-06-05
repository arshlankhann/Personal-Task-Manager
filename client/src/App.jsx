import { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskSearch from './components/TaskSearch';
import TaskCreationForm from './components/TaskCreationForm';
import TaskList from './components/TaskList';
import FilterTabs from './components/FilterTabs';
import EmptyState from './components/EmptyState';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async ({ title, description, dueDate }) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || '',
          dueDate: dueDate || null,
        }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  // ✅ PUT /api/tasks/:id — Edit task
  const editTask = async (id, { title, description, dueDate }) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle task');
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // ✅ PATCH /api/tasks/reorder — Drag & Drop reorder
  const reorderTasks = async (orderedIds) => {
    // Optimistically reorder in UI
    const idIndexMap = {};
    orderedIds.forEach((id, i) => (idIndexMap[id] = i));
    const reordered = [...tasks].sort(
      (a, b) => (idIndexMap[a.id] ?? 999) - (idIndexMap[b.id] ?? 999)
    );
    setTasks(reordered);

    try {
      const response = await fetch(`${API_BASE}/tasks/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (!response.ok) throw new Error('Failed to reorder tasks');
    } catch (error) {
      console.error('Error reordering tasks:', error);
      // Rollback on failure
      fetchTasks();
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase());
    if (filter === 'completed') return task.completed && matchesSearch;
    if (filter === 'active') return !task.completed && matchesSearch;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Header totalTasks={tasks.length} completedTasks={completedCount} />

        {isCreating ? (
          <TaskCreationForm onAdd={addTask} onCancel={() => setIsCreating(false)} />
        ) : (
          <TaskSearch searchValue={searchValue} onSearchChange={setSearchValue} onCreateClick={() => setIsCreating(true)} />
        )}

        {tasks.length > 0 && <FilterTabs activeFilter={filter} onFilterChange={setFilter} />}

        {filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
            onReorder={reorderTasks}
            filter={filter}
          />
        )}
      </div>
    </div>
  );
}
