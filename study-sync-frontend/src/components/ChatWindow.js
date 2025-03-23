import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa6';

const ChatWindow = ({ selectedMatch, userId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages();
    }
  }, [selectedMatch]);

  const fetchMessages = async () => {
    const response = await fetch(`http://127.0.0.1:5000/chat/messages/${userId}/${selectedMatch.id}`);
    const data = await response.json();
    setMessages(data);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedMatch) {
      console.error('No match selected');
      return;
    }
    if (newMessage.trim()) {
      const response = await fetch('http://127.0.0.1:5000/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: selectedMatch.id,
          message: newMessage
        })
      });
      if (response.ok) {
        const newMsg = {
          id: messages.length + 1,
          sender_id: userId,
          receiver_id: selectedMatch.id,
          message: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
      }
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
              className={`message-bubble ${message.sender_id === userId ? 'me' : 'them'}`}
            >
              <div className="message-content">{message.message}</div>
              <div className="message-time">{message.timestamp}</div>
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