import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarAlt, faMapMarkerAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  // Temporary data - replace with actual data from your backend
  const studyMatches = [
    { id: 1, name: 'Sarah Johnson', course: 'Computer Science 101', availability: 'Mon/Wed 2-4 PM', compatibility: '92%' },
    { id: 2, name: 'Mike Chen', course: 'Advanced Calculus', availability: 'Tue/Thu 10 AM-12 PM', compatibility: '85%' },
  ];

  const studyGroups = [
    { id: 1, name: 'CS101 Study Squad', time: 'Today 7:00 PM', location: 'Main Library', members: 3 },
    { id: 2, name: 'Math Wizards', time: 'Tomorrow 3:00 PM', location: 'Online', members: 5 },
  ];

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

      {/* Study Matches Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Your Top Matches</h4>
          <Row xs={1} md={2} lg={3} className="g-4">
            {studyMatches.map((match) => (
              <Col key={match.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{match.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{match.course}</Card.Subtitle>
                    <div className="mb-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                      {match.availability}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">Match Score: {match.compatibility}</span>
                      <Button variant="outline-primary" size="sm">
                        Connect
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Study Groups Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Your Study Groups</h4>
            <Button variant="primary">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Group
            </Button>
          </div>

          <Row xs={1} md={2} className="g-4">
            {studyGroups.map((group) => (
              <Col key={group.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{group.name}</Card.Title>
                    <div className="mb-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                      {group.time}
                    </div>
                    <div className="mb-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                      {group.location}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">{group.members} members</span>
                      <Button variant="primary" size="sm">
                        Join Session
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Group Invitations Section */}
      <Row>
        <Col>
          <h4 className="mb-3">Group Invitations</h4>
          <Alert variant="info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Physics Study Group</strong> - Invited by John Doe
              </div>
              <div>
                <Button variant="outline-success" size="sm" className="me-2">
                  Accept
                </Button>
                <Button variant="outline-danger" size="sm">
                  Decline
                </Button>
              </div>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;