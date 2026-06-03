import { useState, useEffect, useCallback, useRef } from 'react';
import { taskApi } from './services/taskApi';
import TaskCard from './components/TaskCard';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';

/* ── Reusable button styles ── */
const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0 cursor-pointer';
const btnGhost =
  'inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-[#a0a0c0] transition-all duration-200 hover:text-[#f0f0ff] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
const btnDanger =
  'inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-red-400 transition-all duration-200 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

const primaryStyle  = { background: 'linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%)', boxShadow: '0 4px 14px rgba(139,92,246,0.35)' };
const ghostStyle    = { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.07)' };
const dangerStyle   = { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)' };

export default function App() {
  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [filter, setFilter]             = useState('all');
  const [search, setSearch]             = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dragId = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      const data = await taskApi.getAll({ status: filter, search: debouncedSearch });
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch]);

  useEffect(() => { setLoading(true); fetchTasks(); }, [fetchTasks]);

  const allTasks       = tasks;
  const activeTasks    = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleCreate = async (data) => { await taskApi.create(data); setShowAddModal(false); fetchTasks(); };
  const handleUpdate = async (data) => { await taskApi.update(editingTask.id, data); setEditingTask(null); fetchTasks(); };
  const handleToggle = async (id)   => { await taskApi.toggle(id); fetchTasks(); };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    setDeleteLoading(true);
    try { await taskApi.delete(deletingTask.id); setDeletingTask(null); fetchTasks(); }
    catch (err) { setError(err.message); }
    finally { setDeleteLoading(false); }
  };

  const handleDragStart = (e, id) => { dragId.current = id; setDraggingId(id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver  = (e, id) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
    if (dragId.current === id) return;
    setTasks(prev => {
      const from = prev.findIndex(t => t.id === dragId.current);
      const to   = prev.findIndex(t => t.id === id);
      if (from === -1 || to === -1) return prev;
      const next = [...prev]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next;
    });
  };
  const handleDrop = async (e) => {
    e.preventDefault(); setDraggingId(null); dragId.current = null;
    try { await taskApi.reorder(tasks.map(t => t.id)); } catch {}
  };

  const filterCounts = { all: allTasks.length, active: activeTasks.length, completed: completedTasks.length };

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* Background glows */}
      <div className="fixed rounded-full pointer-events-none z-0 w-[500px] h-[500px] -top-24 -right-24"
           style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)', filter: 'blur(80px)' }} />
      <div className="fixed rounded-full pointer-events-none z-0 w-[400px] h-[400px] bottom-0 -left-20"
           style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-[760px] mx-auto px-5 pt-8 pb-16">

        {/* ── Header ── */}
        <header className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            {/* Logo */}
            <div className="w-12 h-12 rounded-[0.875rem] flex items-center justify-center shrink-0"
                 style={{ background: 'linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%)', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>
              <svg className="w-6 h-6 stroke-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div>
              <h1 className="text-[1.75rem] font-extrabold tracking-tight leading-none"
                  style={{ background: 'linear-gradient(135deg,#f0f0ff 0%,#a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                TaskFlow
              </h1>
              <p className="text-[0.8rem] text-[#5a5a80] font-medium mt-0.5">Personal Task Manager</p>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold"
                 style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="font-bold">{activeTasks.length}</span>
              <span className="opacity-80">Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.8rem] font-semibold"
                 style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="font-bold">{completedTasks.length}</span>
              <span className="opacity-80">Done</span>
            </div>
            {tasks.length > 0 && (
              <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: '#1a1a2e' }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${Math.round((completedTasks.length / tasks.length) * 100)}%`, background: 'linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%)' }} />
              </div>
            )}
          </div>
        </header>

        {/* ── Toolbar ── */}
        <div className="flex gap-3 mb-4">
          {/* Search */}
          <div className="flex-1 relative flex items-center">
            <svg className="absolute left-4 w-4 h-4 text-[#5a5a80] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="search-input"
              type="text"
              className="w-full rounded-[0.875rem] pl-11 pr-10 py-3 text-[#f0f0ff] text-[0.9rem] font-[inherit] placeholder:text-[#5a5a80] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              style={{ background: '#141420', border: '1.5px solid rgba(255,255,255,0.07)' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search tasks"
            />
            {search && (
              <button
                className="absolute right-3 flex items-center justify-center w-6 h-6 rounded-full text-[#5a5a80] hover:text-[#f0f0ff] transition-all duration-200 cursor-pointer"
                style={{ background: '#1a1a2e' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1f1f38'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a1a2e'}
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Add Task button */}
          <button
            id="add-task-btn"
            className={`${btnPrimary} whitespace-nowrap shrink-0`}
            style={primaryStyle}
            onClick={() => setShowAddModal(true)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Task
          </button>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-1 rounded-[0.875rem] p-1 mb-6"
             role="tablist" aria-label="Filter tasks by status"
             style={{ background: '#141420', border: '1px solid rgba(255,255,255,0.07)' }}>
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[0.625rem] text-[0.85rem] font-semibold transition-all duration-200 cursor-pointer"
              style={filter === f
                ? { background: '#1f1f38', color: '#f0f0ff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }
                : { background: 'transparent', color: '#5a5a80' }}
              onMouseEnter={e => { if (filter !== f) { e.currentTarget.style.color = '#a0a0c0'; e.currentTarget.style.background = '#1a1a2e'; }}}
              onMouseLeave={e => { if (filter !== f) { e.currentTarget.style.color = '#5a5a80'; e.currentTarget.style.background = 'transparent'; }}}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[0.72rem] font-bold"
                    style={filter === f
                      ? { background: 'rgba(139,92,246,0.25)', color: '#a78bfa' }
                      : { background: '#1a1a2e', color: '#5a5a80' }}>
                {filterCounts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3.5 text-[#f87171] text-sm mb-4" role="alert"
               style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
            <button className="ml-auto text-[#f87171] opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setError('')}>✕</button>
          </div>
        )}

        {/* ── Task List ── */}
        <main className="min-h-[200px]" id="task-list">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-16 text-[#5a5a80] text-sm">
              <div className="w-10 h-10 rounded-full animate-spin"
                   style={{ border: '3px solid rgba(255,255,255,0.07)', borderTopColor: '#8b5cf6' }} />
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl text-[#5a5a80] mb-2"
                   style={{ background: '#141420', border: '1px solid rgba(255,255,255,0.07)' }}>
                {debouncedSearch ? (
                  <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                ) : filter === 'completed' ? (
                  <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                ) : (
                  <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/>
                    <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-bold text-[#a0a0c0]">
                {debouncedSearch ? `No results for "${debouncedSearch}"`
                  : filter === 'completed' ? 'No completed tasks yet'
                  : filter === 'active'    ? 'No active tasks — great work!'
                  : 'No tasks yet'}
              </h3>
              <p className="text-sm text-[#5a5a80]">
                {debouncedSearch ? 'Try a different search term.'
                  : filter === 'all' ? 'Click "Add Task" to get started.' : ''}
              </p>
              {!debouncedSearch && filter === 'all' && (
                <button
                  className={`${btnPrimary} mt-2`}
                  style={primaryStyle}
                  onClick={() => setShowAddModal(true)}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create your first task
                </button>
              )}
            </div>
          ) : (
            <div className="pb-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onEdit={setEditingTask}
                  onDelete={setDeletingTask}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={draggingId === task.id}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Add Task Modal ── */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Task">
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowAddModal(false)} submitLabel="Add Task" />
      </Modal>

      {/* ── Edit Task Modal ── */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <TaskForm initialValues={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} submitLabel="Save Changes" />
        )}
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal isOpen={!!deletingTask} onClose={() => setDeletingTask(null)} title="Delete Task">
        {deletingTask && (
          <div className="flex flex-col items-center gap-5 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-red-400"
                 style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>

            {/* Message */}
            <p className="text-sm text-[#a0a0c0] leading-relaxed max-w-xs">
              Are you sure you want to delete{' '}
              <strong className="text-[#f0f0ff]">"{deletingTask.title}"</strong>?{' '}
              This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 w-full pt-1">
              <button
                className={btnGhost}
                style={ghostStyle}
                disabled={deleteLoading}
                onClick={() => setDeletingTask(null)}
                onMouseEnter={e => !deleteLoading && (e.currentTarget.style.background = '#1f1f38')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1a1a2e')}
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                className={btnDanger}
                style={dangerStyle}
                disabled={deleteLoading}
                onClick={handleDeleteConfirm}
                onMouseEnter={e => !deleteLoading && (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
              >
                {deleteLoading
                  ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block" />
                  : 'Delete Task'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
