'use client';

import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Card, ListGroup } from 'react-bootstrap';

export default function BookPage({ bookData }) {
  const [showModal, setShowModal] = useState(false);
  const [chapterContent, setChapterContent] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('narrative');
  const [targetLength, setTargetLength] = useState(800);
  const [language, setLanguage] = useState('en');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [chapters, setChapters] = useState([]);
  const [slug, setSlug] = useState('');

  // Initialize with book data
  useEffect(() => {
    if (bookData) {
      setChapters(bookData.chapters || []);
      setSlug(bookData.slug || '');
      // Autodeduce language from metadata if available
      if (bookData.metadata?.language) {
        setLanguage(bookData.metadata.language);
      }
    }
  }, [bookData]);

  const handleGenerateChapter = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
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
          target_length: parseInt(targetLength),
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
      setError('Failed to generate chapter: ' + err.message);
    }
  };

  const saveChapter = async () => {
    // Implementation to save chapter
    try {
      // Generate a slug for the chapter
      const chapterSlug = chapterTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'chapter-' + (chapters.length + 1);
      
      // Save the chapter content
      const response = await fetch(`/api/books/${slug}/chapters/${chapterSlug}.txt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: chapterContent,
      });
      
      if (response.ok) {
        // Update metadata.json with the new chapter
        const metadataResponse = await fetch(`/api/books/${slug}/metadata`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'addChapter',
            chapter: {
              title: chapterTitle,
              slug: chapterSlug
            }
          }),
        });
        
        if (metadataResponse.ok) {
          // Add to chapters list
          setChapters([...chapters, {
            title: chapterTitle,
            slug: chapterSlug
          }]);
          setShowPreview(false);
          setShowModal(false);
        } else {
          setError('Failed to update book metadata');
        }
      } else {
        setError('Failed to save chapter');
      }
    } catch (err) {
      console.error('Error saving chapter:', err);
      setError('Failed to save chapter: ' + err.message);
    }
  };

  const discardChapter = () => {
    setShowPreview(false);
    setShowModal(false);
  };

  return (
    <div className="book-page">
      <div className="header">
        <h1>{bookData?.title || 'Book'}</h1>
      </div>
      
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
                required
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

      <Modal size="lg" show={showPreview} onHide={discardChapter}>
        <Modal.Header closeButton>
          <Modal.Title>Chapter Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>{chapterTitle}</h2>
          <div dangerouslySetInnerHTML={{ __html: chapterContent }} />
          <Button onClick={saveChapter}>Save as new chapter</Button>
          <Button variant="secondary" onClick={discardChapter}>Discard</Button>
        </Modal.Body>
      </Modal>
      
      <Card>
        <Card.Header>Chapters</Card.Header>
        <ListGroup variant="flush">
          {chapters.map((chapter, index) => (
            <ListGroup.Item key={index}>
              <a href={`#${chapter.slug}`}>{chapter.title}</a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
}
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

      <Modal size="lg" show={showPreview} onHide={discardChapter}>
        <Modal.Header closeButton>
          <Modal.Title>Chapter Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>{chapterTitle}</h2>
          <div dangerouslySetInnerHTML={{ __html: chapterContent }} />
          <Button onClick={saveChapter}>Save as new chapter</Button>
          <Button variant="secondary" onClick={discardChapter}>Discard</Button>
        </Modal.Body>
      </Modal>
      
      <Card>
        <Card.Header>Chapters</Card.Header>
        <ListGroup variant="flush">
          {chapters.map((chapter) => (
            <ListGroup.Item key={chapter.id}>
              <a href={`#${chapter.slug}`}>{chapter.title}</a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
}