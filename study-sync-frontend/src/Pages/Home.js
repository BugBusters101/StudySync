import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faListCheck, faComments } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: faListCheck,
    title: 'Set Your Preferences',
    desc: 'Tell us your subjects, schedule, and study style. Takes under 2 minutes.',
    color: '#4f46e5',
    bg: '#eef2ff',
  },
  {
    icon: faUsers,
    title: 'Get Matched',
    desc: 'Our algorithm finds peers who share your courses, availability, and learning style.',
    color: '#0891b2',
    bg: '#ecfeff',
  },
  {
    icon: faComments,
    title: 'Start Studying',
    desc: 'Connect over real-time chat and coordinate your next session immediately.',
    color: '#059669',
    bg: '#ecfdf5',
  },
];

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ background: '#f8faff', borderBottom: '1px solid #e5e7eb', padding: '5rem 0 4rem' }}>
        <Container>
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }} className="fade-in">
            <span style={{
              display: 'inline-block',
              background: '#eef2ff',
              color: '#4f46e5',
              border: '1px solid #c7d2fe',
              borderRadius: '100px',
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: '1.5rem',
            }}>
              AI-Powered Study Matching
            </span>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}>
              Find your perfect<br />
              <span style={{ color: '#4f46e5' }}>study partner</span>
            </h1>

            <p style={{
              color: '#6b7280',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '520px',
              margin: '0 auto 2.5rem',
            }}>
              Stop studying alone. StudySync pairs you with peers who match your schedule,
              subjects, and learning style — automatically.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px 28px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background 0.18s ease',
                }}
                onMouseEnter={e => e.target.style.background = '#4338ca'}
                onMouseLeave={e => e.target.style.background = '#4f46e5'}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get started — free'}
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'white',
                    color: '#374151',
                    border: '1.5px solid #d1d5db',
                    borderRadius: '10px',
                    padding: '13px 28px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.18s ease',
                  }}
                  onMouseEnter={e => e.target.style.borderColor = '#9ca3af'}
                  onMouseLeave={e => e.target.style.borderColor = '#d1d5db'}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats ──────────────────────────────────── */}
      <section style={{ padding: '3rem 0', borderBottom: '1px solid #f3f4f6' }}>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            {[
              { value: '500+', label: 'Students matched' },
              { value: '95%', label: 'Match accuracy' },
              { value: '3 min', label: 'Avg. setup time' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── How it works ───────────────────────────── */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
            }}>
              How it works
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>Three simple steps to your ideal study group</p>
          </div>

          <Row className="g-4">
            {features.map((f, i) => (
              <Col key={f.title} md={4}>
                <div style={{
                  padding: '2rem',
                  borderRadius: '14px',
                  border: '1px solid #f3f4f6',
                  background: '#fafafa',
                  height: '100%',
                  transition: 'border-color 0.18s',
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: f.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <FontAwesomeIcon icon={f.icon} style={{ color: f.color, fontSize: '1.1rem' }} />
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#9ca3af',
                    marginBottom: '0.5rem',
                  }}>Step {i + 1}</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                    {f.title}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section style={{ padding: '4rem 0', background: '#f8faff', borderTop: '1px solid #e5e7eb' }}>
        <Container>
          <div style={{
            background: '#4f46e5',
            borderRadius: '16px',
            padding: '3.5rem',
            textAlign: 'center',
            color: 'white',
          }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Ready to study smarter?
            </h2>
            <p style={{ opacity: 0.8, maxWidth: '420px', margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.6 }}>
              Join students already using StudySync to improve their grades and find great study partners.
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              style={{
                background: 'white',
                color: '#4f46e5',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 28px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              {isAuthenticated ? 'View your matches' : 'Create a free account'}
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;