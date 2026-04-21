import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isAuthenticated && token) {
      const newSocket = io('http://127.0.0.1:5000', {
        auth: { token: token },
        query: { token: token }
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        fetch('http://127.0.0.1:5000/chat/unread/total', {
           headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setUnreadCount(data.total_unread || 0))
        .catch(err => console.error("Unread fetch failed", err));
      });
      
      newSocket.on('total_unread_update', (data) => setUnreadCount(data.total_unread));
      newSocket.on('new_notification', (data) => setUnreadCount(prev => prev + 1));
      newSocket.on('disconnect', () => setIsConnected(false));
      newSocket.on('connect_error', () => setIsConnected(false));

      setSocket(newSocket);
      return () => newSocket.close();
    } else {
      setIsConnected(false);
      setSocket(null);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const joinRoom = (otherUserId) => {
    if (socket && isConnected) {
      socket.emit('join_room', { other_user_id: otherUserId });
    }
  };

  const sendMessage = (otherUserId, message) => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        other_user_id: otherUserId,
        message: message
      });
    }
  };

  const emitTyping = (otherUserId) => {
    if (socket && isConnected) {
      socket.emit('typing', { other_user_id: otherUserId });
    }
  };

  const emitMarkRead = (otherUserId) => {
    if (socket && isConnected) {
      socket.emit('mark_read', { other_user_id: otherUserId });
    }
  };

  const value = {
    socket,
    isConnected,
    joinRoom,
    sendMessage,
    emitTyping,
    emitMarkRead,
    unreadCount,
    setUnreadCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
