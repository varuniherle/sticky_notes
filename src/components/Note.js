import React, { useState, forwardRef, useRef } from 'react';
import Draggable from 'react-draggable';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 1:
      return 'rgba(255, 77, 77, 0.2)'; // red with opacity
    case 2:
      return 'rgba(255, 235, 59, 0.2)'; // yellow with opacity
    case 3:
      return 'rgba(76, 175, 80, 0.2)'; // green with opacity
    default:
      return 'rgba(128, 128, 128, 0.2)'; // grey with opacity
  }
};

const Note = forwardRef(({ id, content, onUpdate, onDelete, style, priority }, ref) => {
  const [value, setValue] = useState(content);
  const nodeRef = useRef(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onUpdate(id, newValue);
  };

  return (
    <Draggable nodeRef={nodeRef} >
      <div
        className="note"
        ref={nodeRef}
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
    </Draggable>
  );
});

export default Note;
