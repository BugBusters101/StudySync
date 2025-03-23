import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname: firstName, lastname: lastName, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error.stackTrace);  // Log the error
      setError('An error occurred. Please try again.');
    }
};

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Create Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <div className="row">
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3 col-md-6">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100 mb-3" variant="primary" onClick={() => navigate('/login ')}>
              Sign Up
            </Button>

            <div className="text-center mb-3">or</div>

            <GoogleLoginButton />

            <div className="mt-4 text-center">
              <span className="text-muted">Already have an account? </span>
              <Button variant="link" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Signup;