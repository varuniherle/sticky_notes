import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

const Note = ({ id, content, position, onUpdate, onDelete }) => {
  const [noteContent, setNoteContent] = useState(content);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const nodeRef = useRef(null);

  useEffect(() => {
    setNoteContent(content);
  }, [content]);

  const handleClick = () => {
    if (isFirstClick && content === 'New Note') {
      setNoteContent('');
      onUpdate(id, '');
      setIsFirstClick(false);
    }
  };

  const handleChange = (e) => {
    setNoteContent(e.target.value);
    onUpdate(id, e.target.value);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <Draggable nodeRef={nodeRef} defaultPosition={position} onStop={(e, data) => onUpdate(id, noteContent, { x: data.x, y: data.y })}>
      <div ref={nodeRef} className="note">
        <textarea
          value={noteContent}
          onChange={handleChange}
          onClick={handleClick}
          className="note-content"
        ></textarea>
        <button className="delete-button" onClick={handleDelete}>
          ×
        </button>
      </div>
    </Draggable>
  );
};

export default Note;