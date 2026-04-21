import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { FaCircle } from 'react-icons/fa6';

const ChatList = ({ matches = [], onSelectMatch }) => {
  return (
    <ListGroup variant="flush">
      {matches.length === 0 && (
         <div className="text-center text-muted p-3">No study buddies yet!</div>
      )}
      {matches.map(match => (
        <ListGroup.Item
          key={match.match_user_id}
          action
          onClick={() => onSelectMatch(match)}
          className="chat-list-item d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center gap-2">
            <FaCircle
              size={10}
              className={match.online ? 'text-success' : 'text-secondary'}
            />
            <span>{match.first_name} {match.last_name}</span>
          </div>
          {match.unread_count > 0 && (
            <Badge pill bg="danger">
              {match.unread_count}
            </Badge>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ChatList;