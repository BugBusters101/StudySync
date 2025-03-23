import React, { useEffect, useState } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { FaCircle } from 'react-icons/fa6';

const ChatList = ({ onSelectMatch }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/chat/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        console.log('Fetched users:', data); // Log the fetched data
        setMatches(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <ListGroup variant="flush">
      {matches.map(match => (
        <ListGroup.Item
          key={match.id}
          action
          onClick={() => onSelectMatch(match)}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center gap-2">
            <FaCircle size={10} className="text-secondary" />
            <span>{match.name}</span>
          </div>
          {match.unread > 0 && (
            <Badge pill bg="danger">
              {match.unread}
            </Badge>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ChatList;