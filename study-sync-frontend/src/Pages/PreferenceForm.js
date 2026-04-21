import { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Select from 'react-select';
import './Auth.css';

const PreferencesForm = ({ onSaveSuccess } = {}) => {
  const navigate = useNavigate();
  const { setIsNewUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    courses: [],
    days_of_week: [],
    timeSlots: [],
    learning_style: [],
    location_type: [],
    location_details: []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning (8-11 AM)', 'Afternoon (12-4 PM)', 'Evening (5-8 PM)', 'Night (9 PM-12 AM)'];
  const studyLocations = ['Virtual', 'In-person'];
  const learningStyles = ['Auditory', 'Visual', 'Hands-on', 'Reading/Writing'];
  const locationDetails = ['In-person', 'Zoom', 'Discord', 'Microsoft Teams', 'Slack'];
  const subjects = [
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' }
  ];

  // Pre-load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
        const response = await fetch(`${API_URL}/preferences`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setFormData({
              courses: data.subjects || [],
              days_of_week: data.days_of_week || [],
              timeSlots: data.availability || [],
              learning_style: data.learning_style || [],
              location_type: data.location_type || [],
              location_details: data.location_details || []
            });
          }
        }
      } catch (err) {
        // Silently ignore — preferences may not exist yet
      } finally {
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, []);

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const updated = prev[category]?.includes(value)
        ? prev[category].filter(item => item !== value)
        : [...(prev[category] || []), value];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated. Please login again.');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setSuccess('Preferences saved! Generating matches...');
        const matches = data.matches || [];
        
        // Update user state to allow navigation to dashboard
        setIsNewUser(false);

        setTimeout(() => {
          if (onSaveSuccess) {
            onSaveSuccess(matches);
          } else {
            navigate('/dashboard', { state: { showMatches: true, matches } });
          }
        }, 800);
      } else {
        setError(data.message || 'Could not save preferences.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      border: state.isFocused ? '1.5px solid #4f46e5' : '1.5px solid #e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(79,70,229,0.12)' : 'none',
      padding: '2px 4px',
      background: '#f9fafb',
    }),
    multiValue: (base) => ({ ...base, backgroundColor: '#eef2ff', borderRadius: '6px' }),
    multiValueLabel: (base) => ({ ...base, color: '#4f46e5', fontWeight: 600 }),
    multiValueRemove: (base) => ({ ...base, color: '#4f46e5', ':hover': { background: '#e0e7ff', color: '#4338ca' } }),
  };

  const CheckGroup = ({ items, category, label }) => (
    <Form.Group className="mb-4">
      <Form.Label className="fw-semibold mb-3" style={{ color: 'var(--ss-navy)' }}>{label}</Form.Label>
      <div className="d-flex flex-wrap gap-2">
        {items.map(item => {
          const checked = formData[category]?.includes(item);
          return (
            <label key={item} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
              border: checked ? '1.5px solid #4f46e5' : '1.5px solid #e5e7eb',
              background: checked ? '#eef2ff' : '#f9fafb',
              color: checked ? '#4f46e5' : '#6b7280',
              fontWeight: checked ? 600 : 400,
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange(category, item)}
                style={{ display: 'none' }}
              />
              {checked ? '✓ ' : ''}{item}
            </label>
          );
        })}
      </div>
    </Form.Group>
  );

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: 'var(--ss-blue)' }} />
        <p className="mt-3 text-muted small">Loading your saved preferences...</p>
      </div>
    );
  }

  return (
    <Container className="py-4 fade-in">
      <Row className="justify-content-center">
        <Col md={10} lg={9}>
          {!onSaveSuccess && (
            <div className="mb-4">
              <h2 className="fw-bold gradient-text mb-1">Study Preferences</h2>
              <p className="text-muted">Tell us about yourself so we can find your perfect study partners.</p>
            </div>
          )}

          {error && <Alert variant="danger" className="border-0 rounded-3 small">{error}</Alert>}
          {success && <Alert variant="success" className="border-0 rounded-3 small">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Subjects */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--ss-navy)' }}>
                Subjects You Study
              </Form.Label>
              <Select
                isMulti
                options={subjects}
                value={subjects.filter(s => formData.courses.includes(s.value))}
                onChange={(selected) => setFormData({ ...formData, courses: selected.map(o => o.value) })}
                placeholder="Search and select subjects..."
                className="basic-multi-select"
                classNamePrefix="select"
                styles={selectStyles}
              />
            </Form.Group>

            <CheckGroup items={daysOfWeek} category="days_of_week" label="Available Days" />
            <CheckGroup items={timeSlots} category="timeSlots" label="Preferred Time Slots" />
            <CheckGroup items={learningStyles} category="learning_style" label="Learning Style" />
            <CheckGroup items={studyLocations} category="location_type" label="Study Format" />
            <CheckGroup items={locationDetails} category="location_details" label="Communication Platform" />

            <Button
              type="submit"
              className="w-100 auth-btn mt-2"
              disabled={isSaving}
              style={{ borderRadius: '12px', padding: '14px', fontSize: '1rem', border: 'none' }}
            >
              {isSaving
                ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Saving & Finding Matches...</>
                : 'Save Preferences & Find Matches'
              }
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PreferencesForm;