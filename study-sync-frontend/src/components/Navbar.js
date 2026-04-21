import React, { useContext } from 'react';
import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa6';
import { AuthContext } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { unreadCount } = useSocket();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the correct token key
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <Container>
        <BSNavbar expand="lg" style={{ background: 'transparent' }}>
          {/* Brand */}
          <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <span style={{
              fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#4f46e5'
            }}>StudySync</span>
          </BSNavbar.Brand>

          <BSNavbar.Toggle aria-controls="main-nav" />

          <BSNavbar.Collapse id="main-nav">
            {/* Left links */}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-1" style={{ color: '#374151', fontWeight: 500, fontSize: '0.92rem' }}>
                <FontAwesomeIcon icon={faHome} size="sm" />
                <span>Home</span>
              </Nav.Link>
              {isAuthenticated && (
                <>
                  <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center gap-1" style={{ color: '#374151', fontWeight: 500, fontSize: '0.92rem' }}>
                    <FontAwesomeIcon icon={faUsers} size="sm" />
                    <span>Dashboard</span>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/chat" className="d-flex align-items-center gap-1 position-relative" style={{ color: '#374151', fontWeight: 500, fontSize: '0.92rem' }}>
                    <FaComments />
                    <span>Chat</span>
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute', top: '0', right: '-8px',
                        background: '#ef4444', color: 'white',
                        fontSize: '0.65rem', fontWeight: 700,
                        minWidth: '18px', height: '18px',
                        borderRadius: '10px', display: 'flex',
                        alignItems: 'center', justifyCenter: 'center',
                        border: '2px solid white',
                        padding: '0 4px',
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                      }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Nav.Link>
                </>
              )}
            </Nav>

            {/* Right links */}
            <Nav className="ms-auto align-items-center gap-2">
              {isAuthenticated ? (
                <Nav.Link
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-1"
                  style={{
                    color: '#6b7280', fontWeight: 500, fontSize: '0.92rem',
                    border: '1px solid #e5e7eb', borderRadius: '8px',
                    padding: '6px 14px', transition: 'all 0.15s ease'
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Log out</span>
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" style={{ color: '#374151', fontWeight: 500, fontSize: '0.92rem' }}>
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link} to="/signup"
                    className="d-flex align-items-center gap-1"
                    style={{
                      background: '#4f46e5',
                      borderRadius: '8px', padding: '7px 16px',
                      color: 'white', fontWeight: 600, fontSize: '0.88rem',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    Sign up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </BSNavbar.Collapse>
        </BSNavbar>
      </Container>
    </nav>
  );
};

export default Navbar;