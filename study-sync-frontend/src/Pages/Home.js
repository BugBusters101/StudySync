import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Set Your Preferences',
    desc: 'Pick your subjects, available days, and how you like to study. Quick and simple.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    accent: '#4f46e5',
    light: '#eef2ff',
    border: '#c7d2fe',
  },
  {
    number: '02',
    title: 'Get Matched',
    desc: 'The algorithm finds people who share your courses, schedule, and study habits.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    accent: '#0891b2',
    light: '#ecfeff',
    border: '#a5f3fc',
  },
  {
    number: '03',
    title: 'Start Studying',
    desc: 'Message your matches directly and coordinate your first session right here.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    accent: '#059669',
    light: '#ecfdf5',
    border: '#6ee7b7',
  },
];

const perks = [
  {
    icon: '📚',
    title: 'Course-level matching',
    body: 'Not just your major. We match on exact subjects so you find someone in the same class.',
  },
  {
    icon: '🕐',
    title: 'Schedule compatibility',
    body: 'No more chasing people down. Your matches are free when you are.',
  },
  {
    icon: '🧠',
    title: 'Study style aware',
    body: 'Visual, auditory, hands-on, group or solo. We factor in how you actually learn.',
  },
  {
    icon: '💬',
    title: 'Built-in messaging',
    body: 'Chat with matches without leaving StudySync.',
  },
];

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(155deg, #f9f8ff 0%, #eef2ff 45%, #f0f9ff 100%)',
        padding: '7rem 1.5rem 5.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #e8eaf2',
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -100,
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 68%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -80,
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 68%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 3.75rem)',
            fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.035em', lineHeight: 1.12,
            marginBottom: '1.25rem',
          }}>
            Find a study partner<br />
            <span style={{
              background: 'linear-gradient(130deg, #4f46e5 20%, #0891b2 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              who actually fits
            </span>
          </h1>

          <p style={{
            color: '#64748b', fontSize: '1.08rem', lineHeight: 1.8,
            maxWidth: 500, margin: '0 auto 2.5rem',
          }}>
            StudySync looks at your subjects, schedule, and learning style to find people worth studying with.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              id="hero-cta-primary"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '13px 30px', fontWeight: 700, fontSize: '0.94rem',
                cursor: 'pointer', boxShadow: '0 4px 18px rgba(79,70,229,0.28)',
                transition: 'transform 0.16s, box-shadow 0.16s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 26px rgba(79,70,229,0.34)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(79,70,229,0.28)'; }}
            >
              {isAuthenticated ? 'Go to dashboard' : 'Create a free account'}
            </button>
            {!isAuthenticated && (
              <button
                id="hero-cta-secondary"
                onClick={() => navigate('/login')}
                style={{
                  background: 'white', color: '#334155',
                  border: '1.5px solid #cbd5e1', borderRadius: 12,
                  padding: '13px 26px', fontWeight: 600, fontSize: '0.94rem',
                  cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.16s, box-shadow 0.16s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(79,70,229,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
              >
                Sign in
              </button>
            )}
          </div>

          <p style={{ marginTop: '1.75rem', color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '0.01em' }}>
            Free to use &nbsp;&middot;&nbsp; No credit card needed
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '6rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 940, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#4f46e5', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8 }}>
              How it works
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: 0 }}>
              Up and running in three steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {steps.map(s => (
              <div
                key={s.number}
                style={{
                  background: s.light, border: `1.5px solid ${s.border}`,
                  borderRadius: 20, padding: '2rem 1.75rem', position: 'relative',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 14px 36px ${s.accent}1a`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <span style={{
                  position: 'absolute', top: '1.25rem', right: '1.5rem',
                  fontSize: '3rem', fontWeight: 900, color: `${s.accent}14`,
                  lineHeight: 1,
                }}>
                  {s.number}
                </span>
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.accent, marginBottom: '1.2rem',
                  boxShadow: `0 2px 10px ${s.accent}18`,
                }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(180deg, #f8faff, #f1f5f9)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#0891b2', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8 }}>
              Why it works
            </p>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: 0 }}>
              Matching that actually makes sense
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {perks.map(p => (
              <div
                key={p.title}
                style={{
                  background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16,
                  padding: '1.5rem', transition: 'border-color 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{p.title}</h4>
                <p style={{ fontSize: '0.83rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(145deg, #f8f7ff, #eef2ff, #f0f9ff)',
            border: '1.5px solid #c7d2fe', borderRadius: 24,
            padding: '3.5rem 2.5rem',
            boxShadow: '0 4px 32px rgba(79,70,229,0.07)',
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
              Ready to give it a try?
            </h2>
            <p style={{ color: '#475569', maxWidth: 360, margin: '0 auto 2rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Set up your profile, get matched, and start studying with people who are actually on the same page.
            </p>
            <button
              id="cta-footer"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '13px 30px', fontWeight: 700, fontSize: '0.94rem',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
                transition: 'transform 0.16s, box-shadow 0.16s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.25)'; }}
            >
              {isAuthenticated ? 'View your matches' : 'Get started for free'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;