import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useSocket } from '../contexts/SocketContext';

const ChatPage = () => {
  const { socket } = useSocket();
  const location = useLocation();
  const stateMatch = location.state?.match;
  
  const [selectedMatch, setSelectedMatch] = useState(stateMatch || null);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
        const response = await fetch(`${API_URL}/chat/contacts`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to load contacts');
        const data = await response.json();
        
        // Ensure stateMatch is in sidebar
        let updatedContacts = [...data];
        if (stateMatch) {
            const exists = data.find(c => c.match_user_id === stateMatch.match_user_id);
            if (!exists) {
                updatedContacts = [stateMatch, ...data];
            }
        }
        setContacts(updatedContacts);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchContacts();
  }, [stateMatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      // If message is from a buddy NOT currently selected, increment their unread count
      if (selectedMatch?.match_user_id !== message.sender_id) {
        setContacts(prev => prev.map(c => 
          c.match_user_id === message.sender_id 
            ? { ...c, unread_count: (c.unread_count || 0) + 1 } 
            : c
        ));
      }
    });

    socket.on('messages_read', (data) => {
      // If we are the ones who read the messages, reset that buddy's count
      // reader_id is me
      setContacts(prev => prev.map(c => 
        c.match_user_id === data.sender_id 
          ? { ...c, unread_count: 0 } 
          : c
      ));
    });

    return () => {
      socket.off('new_message');
      socket.off('messages_read');
    };
  }, [socket, selectedMatch]);

  return (
    <Container fluid className="chat-page">
      <Row className="g-0" style={{ minHeight: '80vh' }}>
        <Col md={4} className="border-end">
          {error && <Alert variant="danger" className="m-2 py-2 small">{error}</Alert>}
          <ChatList
            matches={contacts}
            onSelectMatch={setSelectedMatch}
          />
        </Col>
        <Col md={8}>
          <ChatWindow selectedMatch={selectedMatch} />
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;