import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <Container fluid className="chat-page">
      <Row className="g-0" style={{ minHeight: '80vh' }}>
        <Col md={4} className="border-end">
          <ChatList
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