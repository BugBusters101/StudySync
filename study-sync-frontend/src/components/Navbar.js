import React, { useContext } from 'react';
import { Navbar as BSNavbar, Container, Nav, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa6';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token
    setIsAuthenticated(false); // Update authentication state
    navigate('/login'); // Redirect to login page
  };

  const isDashboardPage = location.pathname === '/dashboard'; // Check if the user is on the Dashboard page

  return (
    <BSNavbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Brand Section */}
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="h3 mb-0">StudySync</span>
        </BSNavbar.Brand>

        {/* Navbar Toggler */}
        <BSNavbar.Toggle aria-controls="main-nav" />

        {/* Navbar Collapse */}
        <BSNavbar.Collapse id="main-nav">
          {/* Left Side Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/chat" className="d-flex align-items-center gap-1">
                  <FaComments />
                  <span>Chat</span>
                  <Badge bg="danger" className="ms-1">3</Badge>
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Right Side Links */}
          <Nav className="ms-auto">
            {isDashboardPage ? (
              // Show the Logout Button when on Dashboard, regardless of login status
              <Nav.Link onClick={handleLogout} className="d-flex align-items-center gap-1">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
              </Nav.Link>
            ) : (
              // Show Login and Sign Up buttons if not on Dashboard
              <>
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-1">
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Login</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="d-flex align-items-center gap-1">
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>Sign Up</span>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;