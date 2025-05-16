import React, { useState } from 'react';

const Note = ({ id, content, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(content);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(id, noteContent);
  };

  const handleChange = (e) => {
    setNoteContent(e.target.value);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="note" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <textarea
          value={noteContent}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <>
          <div className="note-content">{noteContent}</div>
          <button className="delete-button" onClick={handleDelete}>
            ×
          </button>
        </>
      )}
    </div>
  );
};

export default Note;