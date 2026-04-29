<<<<<<< HEAD
// Placeholder for the book page component
export default function BookPage() {
  return (
    <div>
      <h1>Book Page</h1>
    </div>
  );
}
=======
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
>>>>>>> 7663ac56e3e488fa833b5d26a207e0ee1402f6d7
