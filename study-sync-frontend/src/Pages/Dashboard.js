import { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarAlt, faMapMarkerAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [studyMatches, setStudyMatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://127.0.0.1:5000/matching`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include token for authentication
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      const data = await response.json();
      setStudyMatches(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const editPreference = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://127.0.0.1:5000/preference`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include token for authentication
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ /* Add preference data here */ })
      });
      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
      const data = await response.json();
      console.log('Preferences updated:', data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMessageClick = (match_user_id) => {
    navigate(`/chat/${match_user_id}`);  // Navigate to the chat endpoint
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Your Dashboard
          </h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4 align-items-center">
        <Col>
          <Button variant="primary" onClick={generateMatches}>
            Generate Matches
          </Button>
        </Col>
        <Col className="mb-4 align-items-right text-end">
         <Button variant="primary" onClick={() => navigate('/preferences')}>
            Edit Preference
          </Button>
        </Col>
      </Row>

      {/* Study Matches Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Your Top Matches</h4>
          <Row xs={1} md={2} lg={3} className="g-4">
            {studyMatches.map((match) => (
              <Col key={match.match_user_id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>User ID: {match.match_user_id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Score: {match.score.toFixed(2)}</Card.Subtitle>
                    <div className="mb-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                      Shared Subjects: {match.shared_subjects.join(', ')}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <Button variant="outline-primary" size="sm" onClick={() => handleMessageClick(match.match_user_id)}>
                        Message
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;