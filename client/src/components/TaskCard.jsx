import { useState, useRef } from 'react';

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, onDragStart, onDragOver, onDrop, isDragging }) {
  const [expanded, setExpanded] = useState(false);
  const overdue = isOverdue(task);
  const dragRef = useRef(null);

  /* Left accent colour */
  const accentColor = task.completed ? '#10b981' : overdue ? '#ef4444' : '#8b5cf6';

  return (
    <>
      <style>{`
        @keyframes cardSlideIn { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulseRed { 0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,0.3) } 50% { box-shadow:0 0 0 3px rgba(239,68,68,0) } }
        .overdue-badge { animation: pulseRed 2s infinite; }
        .task-card-anim { animation: cardSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>

      <div
        ref={dragRef}
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        onDragOver={(e) => onDragOver(e, task.id)}
        onDrop={(e) => onDrop(e, task.id)}
        className={[
          'task-card-anim group relative flex items-start gap-3 rounded-2xl mb-2.5',
          'border transition-all duration-200 overflow-hidden',
          'hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]',
          isDragging ? 'opacity-50 scale-[1.02] shadow-[0_8px_30px_rgba(0,0,0,0.4)]' : '',
          overdue
            ? 'bg-gradient-to-br from-[#141420] to-[rgba(239,68,68,0.05)]'
            : 'bg-[#141420]',
          task.completed ? 'opacity-70' : '',
        ].join(' ')}
        style={{ borderColor: 'rgba(255,255,255,0.07)', paddingLeft: '0' }}
      >
        {/* Left accent stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-tl-2xl rounded-bl-2xl transition-colors duration-200"
          style={{ background: accentColor }}
        />

        {/* Card content row */}
        <div className="flex items-start gap-3 w-full pl-5 pr-4 py-4">
          {/* Drag handle */}
          <div className="flex items-center text-[#5a5a80] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing pt-0.5 shrink-0">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
              <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
              <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
            </svg>
          </div>

          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            className={[
              'flex items-center justify-center w-5.5 h-5.5 min-w-[1.375rem] min-h-[1.375rem] rounded-full border-2 transition-all duration-200 shrink-0 mt-0.5',
              task.completed
                ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'
                : 'border-[rgba(255,255,255,0.14)] bg-transparent hover:border-violet-500 hover:shadow-[0_0_0_4px_rgba(139,92,246,0.1)]',
            ].join(' ')}
          >
            {task.completed && (
              <svg className="w-3 h-3 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div
            className="flex-1 min-w-0"
            onClick={() => task.description && setExpanded((e) => !e)}
          >
            {/* Title row */}
            <div className="flex flex-wrap items-start gap-2">
              <span className={[
                'text-[0.95rem] font-semibold leading-snug break-words transition-colors duration-200',
                task.completed ? 'line-through text-[#5a5a80]' : 'text-[#f0f0ff]',
              ].join(' ')}>
                {task.title}
              </span>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {overdue && (
                  <span className="overdue-badge inline-flex items-center gap-1 text-[0.7rem] font-bold px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/30">
                    Overdue
                  </span>
                )}
                {task.dueDate && !overdue && !task.completed && (
                  <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/25">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {formatDate(task.dueDate)}
                  </span>
                )}
                {task.completed && task.dueDate && (
                  <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold px-2 py-0.5 rounded-md bg-white/5 text-[#5a5a80] border border-[rgba(255,255,255,0.07)]">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className={[
                'mt-1 text-[0.825rem] text-[#5a5a80] leading-relaxed transition-all duration-300',
                expanded ? '' : 'line-clamp-2',
              ].join(' ')}>
                {task.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              title="Edit task"
              aria-label="Edit task"
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/10 text-violet-400 transition-all duration-200 hover:bg-violet-500/25 hover:scale-110"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              onClick={() => onDelete(task)}
              title="Delete task"
              aria-label="Delete task"
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/10 text-red-400 transition-all duration-200 hover:bg-red-500/25 hover:scale-110"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
