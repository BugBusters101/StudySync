import { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const PreferencesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courses: [],
    days_of_week: [],
    timeSlots: [],
    learning_style: '',
    location_type: [],
    location_details: []
  });
  const [error, setError] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning (8-11 AM)', 'Afternoon (12-4 PM)', 'Evening (5-8 PM)', 'Night (9 PM-12 AM)'];
  const studyLocations = ['Virtual', 'in-person'];
  const learningStyles = ['Auditory', 'Visual', 'Hands-on', 'Reading/Writing'];
  const locationDetails = ['In-person', 'Zoom', 'Discord', 'Microsoft Teams', 'Slack'];
  const subjects = [
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' }
  ];

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const updatedCategory = prev[category]?.includes(value)
        ? prev[category].filter(item => item !== value)
        : [...(prev[category] || []), value];
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Retrieve token from localStorage (set after login)
  const token = localStorage.getItem('token');

  if (!token) {
    setError('Not authenticated. Please login again.');
    return;
  }

    try {
      const response = await fetch('http://127.0.0.1:5000/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container className="py-5 fade-in">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="auth-card">
            <Card.Body>
              <h2 className="text-center mb-4">Study Preferences Setup</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-4">
                  <Form.Label>Select Your Subjects</Form.Label>
                  <Select
                    isMulti
                    options={subjects}
                    onChange={(selectedOptions) => setFormData({
                      ...formData,
                      courses: selectedOptions.map(option => option.value)
                    })}
                    placeholder="Search or select subjects..."
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '2px 4px'
                      })
                    }}
                  />
                  <Form.Text className="text-muted">
                    Start typing to search or click to select multiple subjects
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Availability</Form.Label>
                  <div className="mb-3">
                    <strong>Days:</strong>
                    <div className="d-flex flex-wrap gap-3 mt-2">
                      {daysOfWeek.map(day => (
                        <Form.Check
                          key={day}
                          type="checkbox"
                          label={day}
                          checked={formData.days_of_week.includes(day)}
                          onChange={() => handleCheckboxChange('days_of_week', day)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Time Slots:</strong>
                    <div className="d-flex flex-wrap gap-3 mt-2">
                      {timeSlots.map(time => (
                        <Form.Check
                          key={time}
                          type="checkbox"
                          label={time}
                          checked={formData.timeSlots.includes(time)}
                          onChange={() => handleCheckboxChange('timeSlots', time)}
                        />
                      ))}
                    </div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Preferred Learning Style</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {learningStyles.map(style => (
                      <Form.Check
                        key={style}
                        type="checkbox"
                        label={style}
                        checked={formData.learning_style.includes(style)}
                        onChange={() => handleCheckboxChange('learning_style', style)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Preferred Study Locations</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {studyLocations.map(location => (
                      <Form.Check
                        key={location}
                        type="checkbox"
                        label={location}
                        checked={formData.location_type.includes(location)}
                        onChange={() => handleCheckboxChange('location_type', location)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Preferred Communication Methods</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {locationDetails.map(method => (
                      <Form.Check
                        key={method}
                        type="checkbox"
                        label={method}
                        checked={formData.location_details.includes(method)}
                        onChange={() => handleCheckboxChange('location_details', method)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Button type="submit" className="w-100" variant="primary" onClick={handleSubmit}>
                  Save Preferences
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PreferencesForm;