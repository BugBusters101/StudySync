import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Connect to the backend WebSocket server
      const newSocket = io('http://localhost:5001', {
        auth: {
          token: token
        },
        query: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

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

  const value = {
    socket,
    isConnected,
    joinRoom,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
