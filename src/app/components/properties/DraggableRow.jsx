import React, { useState } from 'react';

const DraggableRow = ({ 
  children, 
  index, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onDragEnd,
  className = '' 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    onDragStart?.(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = index;
    onDrop?.(fromIndex, toIndex);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.(index);
  };


  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={` 
        transition-all duration-200 ease-in-out
        ${isDragging ? 'opacity-50 bg-gray-100 scale-95' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default DraggableRow;