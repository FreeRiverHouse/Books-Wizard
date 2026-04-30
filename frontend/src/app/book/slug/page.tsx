// page.tsx
import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const ChapterGenerator = () => {
  const [showModal, setShowModal] = useState(false);
  const [chapterContent, setChapterContent] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('narrative');
  const [targetLength, setTargetLength] = useState(800);
  const [language, setLanguage] = useState('en');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateChapter = async (e) => {
    e.preventDefault();
    
    // Call the API endpoint
    try {
      const response = await fetch('/api/ai/write-chapter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          style,
          target_length: targetLength,
          language
        }),
      });
      
      if (response.status === 503) {
        setError('Configure NVIDIA_API_KEY or LOCAL_MODEL_URL in backend/.env');
        return;
      }
      
      const data = await response.json();
      setChapterTitle(data.chapter_title);
      setChapterContent(data.chapter_content);
      setShowPreview(true);
    } catch (err) {
      console.error('Error generating chapter:', err);
    }
  };

  const saveChapter = () => {
    // Implementation to save chapter
  };

  const discardChapter = () => {
    setShowPreview(false);
    setShowModal(false);
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>🪄 Generate Chapter</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Chapter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGenerateChapter}>
            <Form.Group>
              <Form.Label>Topic</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Style</Form.Label>
              <Form.Control 
                as="select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="narrative">Narrative</option>
                <option value="technical">Technical</option>
                <option value="poetic">Poetic</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Target Length</Form.Label>
              <Form.Control 
                type="number"
                min="200"
                max="3000"
                value={targetLength}
                onChange={(e) => setTargetLength(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Language</Form.Label>
              <Form.Control 
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., en, es, fr"
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" type="submit">
              Generate Chapter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showPreview} onHide={discardChapter}>
        <Modal.Header closeButton>
          <Modal.Title>Chapter Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>{chapterTitle}</h2>
          <div>{chapterContent}</div>
          <Button onClick={saveChapter}>Save as new chapter</Button>
          <Button variant="secondary" onClick={discardChapter}>Discard</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChapterGenerator;