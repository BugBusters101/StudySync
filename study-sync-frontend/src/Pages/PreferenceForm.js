import { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

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
  const [error, setError] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning (8-11 AM)', 'Afternoon (12-4 PM)', 'Evening (5-8 PM)', 'Night (9 PM-12 AM)'];
  const studyLocations = ['Library', 'Cafe', 'Home', 'Campus Study Room', 'Online'];
  const learningStyle = ['Auditory','Visual',];
  const locationDetails= ['In-person', 'Zoom', 'Discord', 'Microsoft Teams', 'Slack'];
  const subjects = [
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' }
  ];

const handleCheckboxChange = (category, value, isNested = false) => {
  setFormData(prev => {
    if (isNested) {
      const updatedCategory = prev.availability[category]?.includes(value)
        ? prev.availability[category].filter(item => item !== value)
        : [...(prev.availability[category] || []), value];
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [category]: updatedCategory
        }
      };
    } else {
      const updatedCategory = prev[category]?.includes(value)
        ? prev[category].filter(item => item !== value)
        : [...(prev[category] || []), value];
      return {
        ...prev,
        [category]: updatedCategory
      };
    }
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjects: formData.courses,
          availability: formData.availability,
          learning_style: formData.studyHabits,
          location_type: formData.locationPreference,
          location_details: formData.communicationPreference
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error.stackTrace);
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
              <Form onSubmit={handleSubmit}>
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

                <Form.Group className="mb-4">
                  <Form.Label>Preferred Communication Methods</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {locationDetails.map(method => (
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