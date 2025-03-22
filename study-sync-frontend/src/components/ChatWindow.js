import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa6';  // For paper plane icon

const ChatWindow = ({ selectedMatch }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! Want to study together?', sender: 'them', time: '10:00 AM' },
    { id: 2, text: 'Sure! How about tomorrow?', sender: 'me', time: '10:05 AM' },
    { id: 3, text: 'Perfect! Library at 2 PM?', sender: 'them', time: '10:10 AM' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: newMessage,
          sender: 'me',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setNewMessage('');
    }
  };

  return (
    <Card className="h-100">
      <Card.Header>
        {selectedMatch?.name || 'Select a study buddy'}
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        <div className="chat-messages flex-grow-1 mb-3">
          {messages.map(message => (
            <div
              key={message.id}
              className={`message-bubble ${message.sender === 'me' ? 'me' : 'them'}`}
            >
              <div className="message-content">{message.text}</div>
              <div className="message-time">{message.time}</div>
            </div>
          ))}
        </div>

        <Form onSubmit={handleSendMessage} className="mt-auto">
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="primary" type="submit">
              <FaPaperPlane />
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatWindow;