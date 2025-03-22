import { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PreferencesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courses: [],
    availability: {
      days: [],
      timeSlots: []
    },
    studyHabits: '',
    locationPreference: [],
    groupSize: '',
    communicationPreference: []
  });

  // Available options
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning (8-11 AM)', 'Afternoon (12-4 PM)', 'Evening (5-8 PM)', 'Night (9 PM-12 AM)'];
  const studyLocations = ['Library', 'Cafe', 'Home', 'Campus Study Room', 'Online'];
  const communicationMethods = ['In-person', 'Zoom', 'Discord', 'Microsoft Teams', 'Slack'];

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation and API call here
    console.log('Submitted Preferences:', formData);
    navigate('/dashboard');
  };

  return (
    <Container className="py-5 fade-in">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="auth-card">
            <Card.Body>
              <h2 className="text-center mb-4">Study Preferences Setup</h2>
              <Form onSubmit={handleSubmit}>
                {/* Course Selection */}
                <Form.Group className="mb-4">
                  <Form.Label>Select Your Courses</Form.Label>
                  <Form.Control
                    as="select"
                    multiple
                    onChange={(e) => setFormData({
                      ...formData,
                      courses: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                  >
                    <option value="CS101">Computer Science 101</option>
                    <option value="MATH201">Advanced Mathematics</option>
                    <option value="PHY301">Physics Fundamentals</option>
                    <option value="ENG401">Engineering Basics</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    Hold CTRL/CMD to select multiple courses
                  </Form.Text>
                </Form.Group>

                {/* Availability */}
                <div className="mb-4">
                  <Form.Label>Availability</Form.Label>
                  <div className="mb-3">
                    <strong>Days:</strong>
                    <div className="d-flex flex-wrap gap-3 mt-2">
                      {daysOfWeek.map(day => (
                        <Form.Check
                          key={day}
                          type="checkbox"
                          label={day}
                          checked={formData.availability.days.includes(day)}
                          onChange={() => handleCheckboxChange('availability.days', day)}
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
                          checked={formData.availability.timeSlots.includes(time)}
                          onChange={() => handleCheckboxChange('availability.timeSlots', time)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Study Habits */}
                <Form.Group className="mb-4">
                  <Form.Label>Preferred Study Time</Form.Label>
                  <div className="d-flex gap-4">
                    <Form.Check
                      type="radio"
                      label="Morning Person"
                      name="studyHabits"
                      checked={formData.studyHabits === 'morning'}
                      onChange={() => setFormData({...formData, studyHabits: 'morning'})}
                    />
                    <Form.Check
                      type="radio"
                      label="Night Owl"
                      name="studyHabits"
                      checked={formData.studyHabits === 'night'}
                      onChange={() => setFormData({...formData, studyHabits: 'night'})}
                    />
                  </div>
                </Form.Group>

                {/* Location Preference */}
                <Form.Group className="mb-4">
                  <Form.Label>Preferred Study Locations</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {studyLocations.map(location => (
                      <Form.Check
                        key={location}
                        type="checkbox"
                        label={location}
                        checked={formData.locationPreference.includes(location)}
                        onChange={() => handleCheckboxChange('locationPreference', location)}
                      />
                    ))}
                  </div>
                </Form.Group>

                {/* Group Size */}
                <Form.Group className="mb-4">
                  <Form.Label>Preferred Group Size</Form.Label>
                  <Form.Select
                    value={formData.groupSize}
                    onChange={(e) => setFormData({...formData, groupSize: e.target.value})}
                  >
                    <option value="">Select group size</option>
                    <option value="1">Individual Study</option>
                    <option value="2-3">2-3 People</option>
                    <option value="4-5">4-5 People</option>
                    <option value="5+">5+ People</option>
                  </Form.Select>
                </Form.Group>

                {/* Communication Preference */}
                <Form.Group className="mb-4">
                  <Form.Label>Preferred Communication Methods</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {communicationMethods.map(method => (
                      <Form.Check
                        key={method}
                        type="checkbox"
                        label={method}
                        checked={formData.communicationPreference.includes(method)}
                        onChange={() => handleCheckboxChange('communicationPreference', method)}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Button type="submit" className="w-100" variant="primary">
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