// page.tsx
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ChapterGenerator = () => {
  const [showModal, setShowModal] = useState(false);
  const [chapterContent, setChapterContent] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');

  const handleGenerateChapter = async (e) => {
    e.preventDefault();
    // Implementation would go here
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Genera Capitolo</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Genera Capitolo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGenerateChapter}>
            <Form.Group>
              <Form.Label>Topic</Form.Label>
              <Form.Control type="text" placeholder="Argomento del capitolo" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stile</Form.Label>
              <Form.Control as="select">
                <option>narrativo</option>
                <option>tecnico</option>
                <option>poetico</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Lingua</Form.Label>
              <Form.Control as="select">
                <option>italiano</option>
                <option>inglese</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChapterGenerator;