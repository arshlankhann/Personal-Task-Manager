import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const priorityStyles = {
  low: 'bg-green-100 text-green-800 border border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  high: 'bg-red-100 text-red-800 border border-red-200',
};

const priorityIcons = {
  low: '',
  medium: '',
  high: '',
};

export default function TaskItem({ task, onToggle, onDelete, onEdit, dragHandleProps, isDragging }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    onEdit(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-300 shadow-md">
        <h3 className="text-sm font-semibold text-blue-700 mb-3">Edit Task</h3>
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white resize-none h-16"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm font-medium"
            >
              ✓ Save
            </button>
            <button
              type="button"
              onClick={handleEditCancel}
              className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors text-sm font-medium"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg border transition-all group ${
        isDragging
          ? 'border-blue-400 shadow-lg scale-[1.01] bg-blue-50 opacity-90'
          : task.completed
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="flex-shrink-0 flex flex-col gap-[3px] justify-center py-1 cursor-grab active:cursor-grabbing opacity-40 sm:opacity-20 group-hover:opacity-70 transition-opacity mt-1.5"
        title="Drag to reorder"
      >
        <span className="block w-3.5 h-[2px] bg-gray-500 rounded"></span>
        <span className="block w-3.5 h-[2px] bg-gray-500 rounded"></span>
        <span className="block w-3.5 h-[2px] bg-gray-500 rounded"></span>
      </div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-colors mt-1 text-xs sm:text-sm ${
          task.completed
            ? 'bg-blue-500 border-blue-500 text-white'
            : 'border-gray-300 hover:border-blue-500 active:border-blue-600'
        }`}
      >
        {task.completed && '✓'}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm sm:text-base font-medium leading-snug ${
            task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}>
            {task.description}
          </p>
        )}
        {/* Priority badge on mobile — show inline below title */}
        {task.priority && (
          <span className={`inline-flex sm:hidden mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}>
            {priorityIcons[task.priority]} {task.priority}
          </span>
        )}
      </div>

      {/* Priority Badge — hidden on mobile (shown inline above) */}
      {task.priority && (
        <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 self-center ${priorityStyles[task.priority]}`}>
          {priorityIcons[task.priority]} {task.priority}
        </span>
      )}

      {/* Action Buttons — always visible on mobile, hover on desktop */}
      <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1 self-center">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100"
          title="Edit task"
        >
          <FiEdit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100"
          title="Delete task"
        >
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
}
