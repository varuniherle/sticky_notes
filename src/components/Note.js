import React, { useState, forwardRef } from 'react';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 1:
      return '#ff4d4d'; // red
    case 2:
      return '#ffeb3b'; // yellow
    case 3:
      return '#4caf50'; // green
    default:
      return '#808080'; // grey
  }
};

const Note = forwardRef(({ id, content, onUpdate, onDelete, style, priority }, ref) => {
  const [value, setValue] = useState(content);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const handleChange = (e) => {
    if (isFirstClick) {
      setValue('');
      setIsFirstClick(false);
      onUpdate(id, e.target.value);
    } else {
      setValue(e.target.value);
      onUpdate(id, e.target.value);
    }
  };

  return (
    
    <div
      className="note"
      ref={ref}
      style={{ ...style, backgroundColor: getPriorityColor(priority) }}
    >
      <textarea
        value={value}
        onChange={handleChange}
        className="note-content"
        autoFocus
      />
      <button className="delete-button" onClick={() => onDelete(id)}>×</button>
    </div>
  );
});

export default Note;
