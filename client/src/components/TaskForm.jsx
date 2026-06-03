import { useState, useEffect } from 'react';

const today = () => new Date().toISOString().split('T')[0];

const inputCls =
  'w-full rounded-xl px-4 py-3 text-[#f0f0ff] text-sm font-[inherit] placeholder:text-[#5a5a80] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500';

const inputStyle = {
  background: '#1a1a2e',
  border: '1.5px solid rgba(255,255,255,0.07)',
};

const inputFocusStyle = {
  background: '#1f1f38',
  border: '1.5px solid #8b5cf6',
};

export default function TaskForm({ initialValues = {}, onSubmit, onCancel, submitLabel = 'Add Task' }) {
  const [title, setTitle]           = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [dueDate, setDueDate]       = useState(initialValues.dueDate ? initialValues.dueDate.split('T')[0] : '');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState('');

  useEffect(() => {
    setTitle(initialValues.title || '');
    setDescription(initialValues.description || '');
    setDueDate(initialValues.dueDate ? initialValues.dueDate.split('T')[0] : '');
    setError('');
  }, [initialValues.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), dueDate: dueDate || null });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name) => ({ ...inputStyle, ...(focused === name ? inputFocusStyle : {}) });

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-400"
             style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-sm font-semibold text-[#a0a0c0] tracking-wide">
          Task Title <span className="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={inputCls}
          style={getInputStyle('title')}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setFocused('title')}
          onBlur={() => setFocused('')}
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-description" className="text-sm font-semibold text-[#a0a0c0] tracking-wide">
          Description <span className="text-xs font-normal text-[#5a5a80]">(optional)</span>
        </label>
        <textarea
          id="task-description"
          className={`${inputCls} resize-y min-h-[80px]`}
          style={getInputStyle('description')}
          placeholder="Add some details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={() => setFocused('description')}
          onBlur={() => setFocused('')}
          rows={3}
        />
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-due-date" className="text-sm font-semibold text-[#a0a0c0] tracking-wide">
          Due Date <span className="text-xs font-normal text-[#5a5a80]">(optional)</span>
        </label>
        <input
          id="task-due-date"
          type="date"
          className={inputCls}
          style={{ ...getInputStyle('dueDate'), colorScheme: 'dark' }}
          value={dueDate}
          min={today()}
          onChange={(e) => setDueDate(e.target.value)}
          onFocus={() => setFocused('dueDate')}
          onBlur={() => setFocused('')}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-[#a0a0c0] transition-all duration-200 hover:text-[#f0f0ff] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1f1f38')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1a1a2e')}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          id="submit-task-btn"
          className="inline-flex items-center justify-center min-w-[110px] px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%)', boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }}
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            : submitLabel}
        </button>
      </div>
    </form>
  );
}
