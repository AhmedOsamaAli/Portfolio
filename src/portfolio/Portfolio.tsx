import React from 'react';
import { experiences, internships, education, skills, achievements, projects } from './data';
import { motion, useReducedMotion } from 'framer-motion';
import './portfolio.css';
import { Img } from './assets';

const accent = {
  title: '#2A5CAA',
  text: '#3A6CB7',
  line: '#1A4B99'
};

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => {
  const prefersReduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      className="section"
      initial={prefersReduced ? false : { opacity: 0, y: 30 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2>{title}</h2>
      {children}
    </motion.section>
  );
};

// GitHub highlights removed per user request.

export const Portfolio: React.FC = () => {
  return (
    <div className="app">
      <FloatingIcons />
      <SectionRail />
      <Header />
      <Hero />
      <main>
        <Section id="experience" title="Experience">
          {experiences.map(exp => (
            <div key={exp.company + exp.start} className="card">
              <header>
                    <h3>{exp.role} @ <span className="company">{exp.company}</span></h3>
                    {exp.logo && (
                      exp.company.toLowerCase().includes('microsoft') ? <Img asset="microsoft" /> : <Img asset="dfki" />
                    )}
                <span className="dates">{exp.start} – {exp.end}</span>
                <span className="location">{exp.location}</span>
              </header>
              <ul>
                {exp.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
        <Section id="internships" title="Internships">
          {internships.map(exp => (
            <div key={exp.company + exp.start} className="card">
              <header>
                    <h3>{exp.role} @ <span className="company">{exp.company}</span></h3>
                    {exp.logo && (
                      exp.company.toLowerCase().includes('microsoft') ? <Img asset="microsoft" /> : <Img asset="dfki" />
                    )}
                <span className="dates">{exp.start} – {exp.end}</span>
                <span className="location">{exp.location}</span>
              </header>
              <ul>
                {exp.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
        <Section id="education" title="Education">
          {education.map(ed => (
            <div key={ed.institution} className="card">
              <header>
                <h3>{ed.degree}</h3>
                <span className="institution">{ed.institution}</span>
                <span className="dates">{ed.start} – {ed.end}</span>
                <span className="location">{ed.location}</span>
              </header>
              {ed.notes && <ul>{ed.notes.map(n => <li key={n}>{n}</li>)}</ul>}
            </div>
          ))}
        </Section>
        <Section id="skills" title="Skills">
          <div className="skills-grid">
            <div>
              <h3>Programming</h3>
              <div className="pill-group">{skills.programming.map(s => <span key={s} className="pill">{s}</span>)}</div>
            </div>
            <div>
              <h3>Miscellaneous</h3>
              <div className="pill-group">{skills.miscellaneous.map(s => <span key={s} className="pill">{s}</span>)}</div>
            </div>
          </div>
        </Section>
        <Section id="achievements" title="Achievements">
          {achievements.map(a => (
            <div key={a.title} className="card achievement">
              <header>
                <h3>{a.title}</h3>
              </header>
              <p>{a.description}</p>
              {a.links && <p className="links">{a.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>)}</p>}
            </div>
          ))}
        </Section>
        <Section id="projects" title="Projects">
          {projects.map(p => (
            <div key={p.name} className="card project">
              <header>
                <h3><a href={p.url} target="_blank" rel="noreferrer">{p.name}</a></h3>
                <span className="dates">{p.start} – {p.end}</span>
              </header>
              <ul>{p.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              <div className="pill-group">{p.stack.map(s => <span key={s} className="pill stack">{s}</span>)}</div>
            </div>
          ))}
        </Section>
        <Section id="contact" title="Contact">
          <div className="contact-links" aria-label="Contact links">
            <p className="contact-intro">Let’s build something great together. Reach out via any channel below:</p>
            <ul className="contact-list">
              <li>
                <a href="mailto:ahmedosamadiab@gmail.com" className="contact-link" aria-label="Email Ahmed">
                  <span className="icon" aria-hidden="true">📧</span>
                  <span>Email</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/ahmedosamadiab/" target="_blank" rel="noreferrer" className="contact-link" aria-label="LinkedIn profile">
                  <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM9.5 9h3.8l.2 1.7c.8-1.3 2.1-2 3.9-2 3 0 4.6 2 4.6 5.4V21h-4v-6.2c0-1.7-.6-2.7-2-2.7-1.5 0-2.3 1-2.3 2.7V21h-4V9z"/></svg>
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/AhmedOsamaAli" target="_blank" rel="noreferrer" className="contact-link" aria-label="GitHub profile">
                  <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.26 3.4.96.11-.76.41-1.26.74-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 012.9-.39c.99 0 1.99.13 2.9.39 2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.42.37.79 1.1.79 2.22 0 1.6-.02 2.88-.02 3.27 0 .31.21.68.8.56A10.52 10.52 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  const [transparent, setTransparent] = React.useState(true);
  const [hide, setHide] = React.useState(false);
  const lastY = React.useRef<number>(0);
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      // become opaque after threshold
      setTransparent(y < 140);
      // hide only when going down beyond hero height
      setHide(goingDown && y > 280);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`site-header ${transparent ? 'transparent' : ''} ${hide ? 'hide' : ''}`}>    
      <div className="brand">
        <h1 className="glow">Ahmed Osama</h1>
  <p className="tag">Software Engineer</p>
      </div>
      <Nav />
      <ThemeToggle />
    </header>
  );
};

const Hero: React.FC = () => {
  const prefersReduced = useReducedMotion();
  return (
    <motion.section
      id="hero"
      className="hero"
      initial={prefersReduced ? false : { opacity: 0, y: 40 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="hero-inner">
  <Img asset="headshot" />
  <h2 className="hero-title">Software Engineer crafting resilient & performant products.</h2>
  <p className="hero-sub">Focused on clean architecture, automation, performance optimization and developer experience. I build reliable pipelines and user-centric full-stack applications.</p>
        <div className="hero-cta">
          <a href="#projects" className="btn primary">View Projects</a>
          <a href="mailto:ahmedosamadiab@gmail.com" className="btn secondary">Get in Touch</a>
        </div>
      </div>
      <div className="hero-bg" aria-hidden="true" />
    </motion.section>
  );
};

const Nav: React.FC = () => {
  const sections = ['experience','internships','education','skills','achievements','projects','contact'];
  return (
    <nav>
      <ul>
        {sections.map(s => <li key={s}><a href={'#'+s}>{s}</a></li>)}
      </ul>
    </nav>
  );
};

const ThemeToggle: React.FC = () => {
  const initialPref = () => {
    if (typeof window === 'undefined') return false; // default light (false)
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return true;
      return false; // force light default when no stored value
    } catch {
      return false;
    }
  };
  const [dark, setDark] = React.useState<boolean>(initialPref);
  React.useEffect(() => {
    const theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch {}
  }, [dark]);
  return (
    <button
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      className="theme-toggle"
      onClick={() => setDark(d => !d)}
    >
      {dark ? '☾' : '☀'}
    </button>
  );
};

const Footer: React.FC = () => (
  <footer className="site-footer">
    <small>&copy; {new Date().getFullYear()} Ahmed Osama.</small>
  </footer>
);

// Right side section navigation rail
const sectionMeta: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'internships', label: 'Internships', icon: '🛠️' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'skills', label: 'Skills', icon: '🧠' },
  { id: 'achievements', label: 'Achievements', icon: '🏅' },
  { id: 'projects', label: 'Projects', icon: '🗂️' },
  { id: 'contact', label: 'Contact', icon: '✉️' }
];

const SectionRail: React.FC = () => {
  const [active, setActive] = React.useState<string>('experience');
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.2 }
    );
    sectionMeta.forEach(meta => {
      const el = document.getElementById(meta.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <nav className="section-rail" aria-label="Section navigation">
      <ul>
        {sectionMeta.map(m => (
          <li key={m.id}>
            <a href={`#${m.id}`} className={m.id === active ? 'active' : ''} aria-current={m.id === active ? 'true' : undefined}>
              <span className="icon" aria-hidden="true">{m.icon}</span>
              <span className="sr-only">{m.label}</span>
              <span className="tooltip" role="tooltip">{m.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Subtle floating programming icons background layer
const techIcons = [
  { id: 'ts', path: 'M3 3h18v18H3z', label: 'TypeScript', fill: '#2f74c0', inner: 'M9.5 10v1.4h2.2v7.1h2.1v-7.1h2.3V10H9.5zm.2-3.9V8h7.9V6.1h-3V3h-2.1v3.1h-2.8z' },
  { id: 'react', path: 'M12 11.1a.9.9 0 100 1.8.9.9 0 000-1.8z', label: 'React', fill: '#61dafb', ring: true },
  { id: 'node', path: 'M12 2l9.5 5.5v9L12 22l-9.5-5.5v-9L12 2z', label: 'Node.js', fill: '#83cd29' },
  { id: 'python', path: 'M12.9 3.1c-.6-1.7-2.2-1.7-2.2-1.7H9.3c-1.9 0-2.2 1.4-2.2 1.4v2.5h5.8v1.3H5.7S3 6.3 3 9.1c0 2.9 2.7 2.8 2.7 2.8h1.5v-2.1s-.1-2.7 2.6-2.7h4.4s2.5.1 2.5-2.5c0-2.6-1.8-3.1-1.8-3.1h-2M10 4.3a.8.8 0 110-1.6.8.8 0 010 1.6zM11.1 20.9c.6 1.7 2.2 1.7 2.2 1.7h1.4c1.9 0 2.2-1.4 2.2-1.4v-2.5h-5.8v-1.3h7.2s2.7.4 2.7-2.4c0-2.9-2.7-2.8-2.7-2.8h-1.5v2.1s.1 2.7-2.6 2.7H12c-2.5 0-2.5 2.5-2.5 2.5 0 2.6 1.8 3.1 1.8 3.1h1.8M14 19.7a.8.8 0 110 1.6.8.8 0 010-1.6z', label: 'Python', fill: '#3776ab' },
  { id: 'git', path: 'M2 12l10-10 10 10-10 10L2 12zm9-3v6h2V9h-2zm0 8v2h2v-2h-2z', label: 'Git', fill: '#f05133' }
];

const FloatingIcons: React.FC = () => {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;
  return (
    <div className="floating-icons" aria-hidden="true">
      {techIcons.map((ico, i) => (
        <div
          key={ico.id}
          className="floating-icon"
          style={{ ['--i' as any]: i }}
        >
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
            {ico.ring && (
              <circle cx="12" cy="12" r="10" stroke="#61dafb" strokeWidth="1.4" strokeOpacity="0.6" />
            )}
            <path d={ico.path} fill={ico.fill} fillOpacity="0.85" />
            {ico.inner && <path d={ico.inner} fill="#fff" fillOpacity="0.85" />}
          </svg>
        </div>
      ))}
    </div>
  );
};


export default Portfolio;
