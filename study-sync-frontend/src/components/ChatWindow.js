import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FaPaperPlane, FaCheck, FaCheckDouble } from 'react-icons/fa6';
import { useSocket } from '../contexts/SocketContext';

const ChatWindow = ({ selectedMatch }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { socket, isConnected, sendMessage, joinRoom, emitTyping, emitMarkRead } = useSocket();
  const messagesEndRef = useRef(null);
  const typingDisplayTimeoutRef = useRef(null);
  const typingEmitTimeoutRef = useRef(null);

  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.user_id;
    } catch { return null; }
  };
  const myUserId = getUserId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedMatch && socket) {
       joinRoom(selectedMatch.match_user_id);
       emitMarkRead(selectedMatch.match_user_id); // Mark messages read automatically
       
       socket.on('message_history', (data) => {
          setMessages(data.messages || []);
          scrollToBottom();
       });

       socket.on('new_message', (message) => {
          setMessages(prev => [...prev, message]);
          if (message.sender_id === selectedMatch.match_user_id) {
             emitMarkRead(selectedMatch.match_user_id);
          }
          scrollToBottom();
       });
       
       socket.on('user_typing', (data) => {
          if (data.user_id === selectedMatch.match_user_id) {
             setIsTyping(true);
             clearTimeout(typingDisplayTimeoutRef.current);
             typingDisplayTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
             scrollToBottom();
          }
       });
       
       socket.on('messages_read', (data) => {
          if (data.reader_id === selectedMatch.match_user_id) {
             setMessages(prev => prev.map(m => m.sender_id === myUserId ? {...m, is_read: 1} : m));
          }
       });

       return () => {
          socket.off('message_history');
          socket.off('new_message');
          socket.off('user_typing');
          socket.off('messages_read');
          clearTimeout(typingDisplayTimeoutRef.current);
       };
    }
  }, [selectedMatch, socket, joinRoom]);

  useEffect(() => {
     scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedMatch) {
      sendMessage(selectedMatch.match_user_id, newMessage);
      setNewMessage('');
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
      setNewMessage(e.target.value);
      if (selectedMatch) {
          if (!typingEmitTimeoutRef.current) {
              emitTyping(selectedMatch.match_user_id);
              typingEmitTimeoutRef.current = setTimeout(() => {
                  typingEmitTimeoutRef.current = null;
              }, 1500); // Debounce interval
          }
      }
  };

  if (!selectedMatch) {
    return (
      <Card className="h-100 border-0 shadow-sm d-flex align-items-center justify-content-center bg-light">
        <div className="text-muted text-center p-5">
           <h5>No Conversation Selected</h5>
           <p className="mb-0">Select a study buddy to start chatting</p>
        </div>
      </Card>
    );
  }

  // User ID resolved earlier directly

  return (
    <Card className="h-100 border-0 shadow-sm position-relative" style={{borderRadius: '16px'}}>
      
      {!isConnected && (
         <div className="position-absolute top-0 start-0 w-100 h-100 z-3 d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '16px'}}>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-dark fw-bold">Connecting to Chat Server...</h5>
            <p className="text-muted small">Please wait while we establish a secure connection.</p>
         </div>
      )}

      <Card.Header className="bg-white border-bottom py-3 px-4 fw-bold shadow-sm" style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
        {selectedMatch?.first_name} {selectedMatch?.last_name}
      </Card.Header>
      
      <Card.Body className="d-flex flex-column p-0 bg-light" style={{borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}>
        <div className="chat-messages flex-grow-1 p-4" style={{overflowY: 'auto', maxHeight: '60vh'}}>
          {messages.map(message => {
            const isMe = message.sender_id === myUserId;
            return (
            <div
              key={message.id}
              className={`message-bubble mb-3 d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
            >
              <div 
                 className={`message-content px-3 py-2 ${isMe ? 'bg-primary text-white text-end' : 'bg-white text-dark border'}`}
                 style={{borderRadius: '16px', maxWidth: '75%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}
              >
                 {message.message || message.text}
              </div>
              <div className="message-time text-muted mt-1 d-flex align-items-center gap-1" style={{fontSize: '0.75rem'}}>
                 {new Date(message.timestamp || message.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 {isMe && (message.is_read ? <FaCheckDouble className="text-primary"/> : <FaCheck />)}
              </div>
            </div>
          )})}
          
          {isTyping && (
             <div className="text-muted small ps-2 fst-italic mb-3">
               {selectedMatch?.first_name} is typing...
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <Form onSubmit={handleSendMessage} className="p-3 bg-white border-top" style={{borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              value={newMessage}
              className="px-3"
              style={{borderRadius: '20px'}}
              onChange={handleTyping}
              disabled={!isConnected}
            />
            <Button variant="primary" type="submit" disabled={!isConnected} className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              <FaPaperPlane size={14} />
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatWindow;