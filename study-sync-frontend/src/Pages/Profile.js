import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PreferencesForm from './PreferenceForm';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) return null;

  return (
    <Container className="py-5 fade-in">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0" style={{ borderRadius: '16px' }}>
            <Card.Header className="bg-white border-bottom py-4" style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
              <h3 className="mb-0 text-primary fw-bold">My Profile</h3>
              <p className="text-muted mb-0">Manage your study preferences and account settings</p>
            </Card.Header>
            <Card.Body className="bg-light p-0 pt-4" style={{borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}>
              <PreferencesForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
