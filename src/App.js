import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import initialNotes from './data/initialNotes';
import './App.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

function MyVerticallyCenteredModal({ show, onHide, onAddNote }) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('');

  const handleAddNote = () => {
    const parsedPriority = priority ? parseInt(priority, 10) : 0;
    onAddNote(content, parsedPriority);
    setContent('');
    setPriority('');
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add New Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="new-note-content">
            <Form.Label>Note Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="new-note-priority">
            <Form.Label>Priority</Form.Label>
            <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">Random (Grey)</option>
              <option value="1">1 - Red (High Priority)</option>
              <option value="2">2 - Yellow (Medium Priority)</option>
              <option value="3">3 - Green (Low Priority)</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddNote}>
          Add Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function App() {
  const [modalShow, setModalShow] = useState(false);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('sticky-notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [groupByPriority, setGroupByPriority] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  const addNote = (content, priority) => {
    const newNote = {
      id: Date.now(),
      content: content || 'New Note',
      priority: priority ?? 0,
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('sticky-notes', JSON.stringify(updatedNotes));
    setModalShow(false);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('sticky-notes', JSON.stringify(newNotes));
  };

  const updateNote = (id, newContent) => {
    const newNotes = notes.map((note) =>
      note.id === id ? { ...note, content: newContent } : note
    );
    setNotes(newNotes);
    localStorage.setItem('sticky-notes', JSON.stringify(newNotes));
  };

  const filteredNotes = searchTerm
    ? notes.filter((note) =>
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notes;

  return (
    <div className="App py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h1 className="mb-0">Sticky Notes</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setModalShow(true)} className="me-2">
            Add Note
          </Button>
          <Button
            variant="secondary"
            onClick={() => setGroupByPriority(!groupByPriority)}
          >
            {groupByPriority ? 'Display as Grid' : 'Display by Priority'}
          </Button>
        </Col>
      </Row>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onAddNote={addNote}
      />

      <Row className="mb-4">
        <Col>
          <Form.Control
            ref={searchInputRef}
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {!groupByPriority ? (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
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
            const notesForPriority = filteredNotes.filter(
              (note) => note.priority === priority
            );
            if (notesForPriority.length === 0) return null;

            const priorityLabel =
              priority === 1
                ? 'Priority 1 (High)'
                : priority === 2
                ? 'Priority 2 (Medium)'
                : priority === 3
                ? 'Priority 3 (Low)'
                : 'Random';

            return (
              <div key={priority} className="priority-section mb-4">
                <h2>{priorityLabel}</h2>
                <div className="notes-grid">
                  {notesForPriority.map((note) => (
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
