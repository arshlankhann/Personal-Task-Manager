import { useState, useRef } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder, filter }) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragNodeRef = useRef(null);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    dragNodeRef.current = e.currentTarget;
    // slight delay so the ghost image looks clean
    setTimeout(() => {
      if (dragNodeRef.current) dragNodeRef.current.style.opacity = '0.4';
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, id) => {
    e.preventDefault();
    if (id !== draggedId) setDragOverId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const allIds = filteredTasks.map((t) => t.id);
    const fromIndex = allIds.indexOf(draggedId);
    const toIndex = allIds.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...allIds];
    reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, draggedId);

    onReorder(reordered);
  };

  const handleDragEnd = (e) => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = '1';
    setDraggedId(null);
    setDragOverId(null);
    dragNodeRef.current = null;
  };

  return (
    <div className="space-y-2">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragEnter={(e) => handleDragEnter(e, task.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, task.id)}
          onDragEnd={handleDragEnd}
          className={`transition-transform duration-150 ${
            dragOverId === task.id && draggedId !== task.id
              ? 'translate-y-[-4px] shadow-md'
              : ''
          }`}
        >
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            isDragging={draggedId === task.id}
            dragHandleProps={{}}
          />
        </div>
      ))}
    </div>
  );
}
