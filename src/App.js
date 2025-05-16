import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import './App.css';

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      content: 'New Note'
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, newContent) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, content: newContent } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Sticky Notes</h1>
        <button className="add-button" onClick={addNote}>Add Note</button>
      </div>
      <div className="notes-grid">
        {notes.map(note => (
          <Note
            key={note.id}
            id={note.id}
            content={note.content}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
