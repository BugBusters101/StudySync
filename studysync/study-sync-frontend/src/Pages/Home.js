import { Button, Container } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="mt-5 text-center">
      <h1 className="display-4">Welcome to StudySync</h1>
      <p className="lead">Find your perfect study match today!</p>
      <div className="d-grid gap-2 d-md-block">
        <Button variant="primary" href="/login" className="m-2">
          Get Started
        </Button>
        <Button variant="outline-secondary" href="/dashboard" className="m-2">
          Learn More
        </Button>
      </div>
    </Container>
  );
};

export default Home;