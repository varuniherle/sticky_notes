import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import initialNotes from './data/initialNotes';
import './App.css';

const filterNotes = (notes, searchTerm) => {
  if (!searchTerm) return notes;
  return notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const calculateNotePosition = (index) => {
  const noteWidth = 200;
  const noteHeight = 200;
  const gap = 20;    // gap between notes horizontally and vertically
  const padding = 30; // padding inside container for top and sides

  // Decide how many notes per row based on screen width
  let notesPerRow;
  if (window.innerWidth <= 600) {
    notesPerRow = 1;
  } else if (window.innerWidth <= 1024) {
    notesPerRow = 2;
  } else {
    notesPerRow = 3;   // fixed 3 notes per row on desktop
  }

  const row = Math.floor(index / notesPerRow);
  const col = index % notesPerRow;

  // Calculate total width for all notes + gaps in a row
  const totalWidthOfNotes = notesPerRow * noteWidth + (notesPerRow - 1) * gap;

  // Calculate horizontal start position to center notes with padding on sides
  const containerWidth = window.innerWidth - padding * 2;
  const startX = (containerWidth - totalWidthOfNotes) / 2 + padding;

  return {
    x: startX + col * (noteWidth + gap),
    y: padding + row * (noteHeight + gap),
  };
};



function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    return savedNotes
      ? JSON.parse(savedNotes)
      : initialNotes.map((note, index) => ({
          ...note,
          position: calculateNotePosition(index)
        }));
  });

  useEffect(() => {
    const handleResize = () => {
      setNotes(prevNotes =>
        prevNotes.map((note, index) => ({
          ...note,
          position: calculateNotePosition(index)
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      content: 'New Note',
      position: calculateNotePosition(notes.length)
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, newContent, position) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, content: newContent, position: position || note.position }
        : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="App">
      <div className="header">
        <div className="header-top">
          <h1>Sticky Notes</h1>
          <button className="add-button" onClick={addNote}>Add Note</button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <div className="notes-grid">
        {filterNotes(notes, searchTerm).map(note => (
          <Note
            key={note.id}
            id={note.id}
            content={note.content}
            position={note.position}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        ))}
      </div>
    </div>
  );
}

export default App;