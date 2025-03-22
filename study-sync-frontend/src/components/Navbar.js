import { Container, Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="h3 mb-0">StudySync</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faUsers} />
              <span>Dashboard</span>
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faSignInAlt} />
              <span>Login</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" className="d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Sign Up</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;