import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarAlt, faUserEdit, faClock, faGraduationCap, faSync, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import PreferencesForm from './PreferenceForm';
import './Auth.css';

const BADGE_MAP = [
  { key: 'shared_subjects', label: 'Subjects', icon: faGraduationCap, cls: 'badge-subject' },
  { key: 'shared_days', label: 'Days', icon: faCalendarAlt, cls: 'badge-day' },
  { key: 'shared_slots', label: 'Time Slots', icon: faClock, cls: 'badge-time' },
  { key: 'shared_style', label: 'Style', icon: faGraduationCap, cls: 'badge-style' },
  { key: 'shared_location', label: 'Location', icon: faMapMarkerAlt, cls: 'badge-location' },
];

const Dashboard = () => {
  const { userName, setUserName } = useContext(AuthContext);
  const [studyMatches, setStudyMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeKey, setActiveKey] = useState('matches');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If name is missing but we're authenticated, fetch it
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token && !userName) {
        try {
          const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
          const res = await fetch(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUserName(data.first_name);
          }
        } catch (e) {}
      }
    };
    fetchProfile();
  }, [userName, setUserName]);

  const fetchCachedMatches = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/matching/cached`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to load matches');
      const data = await response.json();
      setStudyMatches(data);
    } catch (err) {
      console.error("Match error:", err);
      setError('Failed to load your study matches. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMatches = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/matching`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to refresh matches');
      const data = await response.json();
      setStudyMatches(data);
    } catch (err) {
      setError('Could not refresh matches. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCachedMatches();
    // If we came from Preferences with a 'showMatches' flag, show matches tab
    if (location.state?.showMatches) {
      setActiveKey('matches');
      // If matches were passed directly in state, use them
      if (location.state?.matches?.length > 0) {
        setStudyMatches(location.state.matches);
        setIsLoading(false);
      }
    }
  }, [location.state]);

  return (
    <Container className="py-5 fade-in">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col lg={8}>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--ss-navy)', letterSpacing: '-0.02em' }}>
            <FontAwesomeIcon icon={faUsers} className="me-3 text-primary"/>
            Welcome back{userName ? `, ${userName}` : ''}!
          </h2>
          <p className="text-muted">Find compatible study partners based on your preferences.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="border-0 shadow-sm rounded-3">{error}</Alert>}

      <Tabs activeKey={activeKey} onSelect={setActiveKey} className="mb-4 custom-tabs">
        {/* ── Matches ── */}
        <Tab eventKey="matches" title="Matches">
          <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
            <h4 className="mb-0 fw-bold" style={{ color: 'var(--ss-navy)' }}>Top Compatible Buddies</h4>
            <Button
              variant="outline-primary"
              size="sm"
              className="d-flex align-items-center gap-2"
              onClick={refreshMatches}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faSync} spin={isLoading} />
              Refresh Matches
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: 'var(--ss-blue)' }} />
              <p className="mt-3 text-muted">Finding your best study partners...</p>
            </div>
          ) : studyMatches.length === 0 ? (
            <Card className="text-center p-5 border-0 shadow-sm" style={{ borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Card.Body>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h5 className="fw-bold" style={{ color: 'var(--ss-navy)' }}>No matches yet</h5>
                <p className="text-muted small mb-4">Go to "Edit Profile" to set your preferences — matches will be generated automatically!</p>
                <div style={{ maxWidth: '240px', margin: '0 auto' }}>
                  <Button className="auth-btn" onClick={() => setActiveKey('profile')}>
                    <FontAwesomeIcon icon={faUserEdit} className="me-2"/>
                    Set Preferences
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {studyMatches.map((match) => (
                <Col key={match.match_user_id}>
                  <Card className="h-100 shadow-sm border-0 match-card" style={{ borderRadius: '20px' }}>
                    <Card.Body className="p-4 d-flex flex-column">
                      {/* Name + Score */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="fw-bold mb-0" style={{ color: 'var(--ss-navy)' }}>
                            {match.first_name} {match.last_name}
                          </h5>
                          <small className="text-muted">{match.email}</small>
                        </div>
                        {match.score && (
                          <div className="badge px-2 py-1 rounded-pill fw-bold" style={{
                            background: 'var(--ss-mint-light)', color: 'var(--ss-mint-dark)',
                            border: '1px solid rgba(5,150,105,0.25)', fontSize: '0.8rem'
                          }}>
                            {(match.score * 100).toFixed(0)}% Match
                          </div>
                        )}
                      </div>

                      {/* Overlap badges */}
                      <div className="flex-grow-1 mb-3">
                        <div className="d-flex text-muted small mb-2 align-items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                          <span className="fw-semibold">Overlap:</span>
                        </div>
                        {BADGE_MAP.every(b => (match[b.key] || []).length === 0) ? (
                          <span className="text-muted small fst-italic">No overlap found</span>
                        ) : (
                          BADGE_MAP.map(({ key, label, cls }) => {
                            const items = match[key] || [];
                            if (items.length === 0) return null;
                            return items.map(item => (
                              <span key={`${key}-${item}`} className={`badge me-1 mb-1 px-2 py-1 ${cls}`} style={{ borderRadius: '6px', fontSize: '0.78rem' }}>
                                {item}
                              </span>
                            ));
                          })
                        )}
                      </div>

                      <Button
                        className="auth-btn w-100"
                        onClick={() => navigate('/chat', { state: { match } })}
                      >
                        Start Chatting
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        {/* ── Edit Profile ── */}
        <Tab eventKey="profile" title="Edit Profile">
          <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
            <Card.Header className="bg-white border-bottom py-3 px-4" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--ss-navy)' }}>
                <FontAwesomeIcon icon={faUserEdit} className="me-2 text-primary" />
                Study Preferences
              </h5>
            </Card.Header>
            <Card.Body style={{ background: 'var(--ss-gray-50)', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <PreferencesForm onSaveSuccess={(matches) => {
                setStudyMatches(matches || []);
                setActiveKey('matches');
              }} />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;