import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import initialNotes from './data/initialNotes';
import './App.css';

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('sticky-notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupByPriority, setGroupByPriority] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addNote = (content, priority) => {
    const newNote = {
      id: Date.now(),
      content: content || 'New Note',
      priority: priority ?? 0,
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('sticky-notes', JSON.stringify(updatedNotes));
    closeModal();
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('sticky-notes', JSON.stringify(newNotes));
  };

  const updateNote = (id, newContent) => {
    const newNotes = notes.map(note =>
      note.id === id ? { ...note, content: newContent } : note
    );
    setNotes(newNotes);
    localStorage.setItem('sticky-notes', JSON.stringify(newNotes));
  };

  const filteredNotes = searchTerm
    ? notes.filter(note =>
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notes;

  return (
    <div className="App">
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <textarea id="new-note-content" placeholder="Enter note content..." />
            <select id="new-note-priority" defaultValue="">
              <option value="">Random (Grey)</option>
              <option value="1">1 - Red (High Priority)</option>
              <option value="2">2 - Yellow (Medium Priority)</option>
              <option value="3">3 - Green (Low Priority)</option>
            </select>
            <button
              onClick={() => {
                const content = document.getElementById('new-note-content').value;
                const priorityValue = document.getElementById('new-note-priority').value;
                const priority = priorityValue ? parseInt(priorityValue, 10) : 0;
                addNote(content, priority);
              }}
            >
              Add Note
            </button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      <div className="header">
        <div className="header-top">
          <h1>Sticky Notes</h1>
          <button className="add-button" onClick={openModal}>Add Note</button>
          <button className="group-button" onClick={() => setGroupByPriority(!groupByPriority)}>
            {groupByPriority ? 'Display as Grid' : 'Display by Priority'}
          </button>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search notes..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!groupByPriority ? (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <Note
              key={note.id}
              id={note.id}
              content={note.content}
              priority={note.priority}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      ) : (
        <div className="notes-group">
          {[1, 2, 3, 0].map((priority) => {
            const notesForPriority = filteredNotes.filter(note => note.priority === priority);
            if (notesForPriority.length === 0) return null;

            const priorityLabel = priority === 1 ? 'Priority 1 (High)' :
                                  priority === 2 ? 'Priority 2 (Medium)' :
                                  priority === 3 ? 'Priority 3 (Low)' : 'Random';

            return (
              <div key={priority} className="priority-section">
                <h2>{priorityLabel}</h2>
                <div className="notes-grid">
                  {notesForPriority.map(note => (
                    <Note
                      key={note.id}
                      id={note.id}
                      content={note.content}
                      priority={note.priority}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
