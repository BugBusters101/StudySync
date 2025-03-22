import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { FaCircle } from 'react-icons/fa6';  // For solid circle icon

const ChatList = ({ matches, onSelectMatch }) => {
  // Mock data
  const mockMatches = [
    { id: 1, name: 'Sarah Johnson', unread: 2, online: true },
    { id: 2, name: 'Mike Chen', unread: 0, online: false },
    { id: 3, name: 'Emma Wilson', unread: 5, online: true },
  ];

  return (
    <ListGroup variant="flush">
      {mockMatches.map(match => (
        <ListGroup.Item
          key={match.id}
          action
          onClick={() => onSelectMatch(match)}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center gap-2">
            <FaCircle
              size={10}
              className={match.online ? 'text-success' : 'text-secondary'}
            />
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