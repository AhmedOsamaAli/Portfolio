import React from 'react';
import { experiences, internships, education, skills, achievements, projects } from './data';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import './portfolio.css';
import { Img } from './assets';
import ParticlesBackground from './ParticlesBackground';
import { Card3D } from './Card3D';
import CursorTrail from './CursorTrail';
import { RippleEffect } from './RippleEffect';
import { ParallaxSections } from './ParallaxSections';
import { TextReveal } from './TextReveal';
import { QuickActionMenu } from './QuickActionMenu';
import { getProjectTheme, getTechIcon } from './projectThemes';
import { MicrosoftLogo, DFKILogo, GIULogo } from './CompanyLogos';

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
      <motion.h2 
        className="section-title-enhanced"
        initial={prefersReduced ? false : { opacity: 0, x: -30 }}
        whileInView={prefersReduced ? {} : { opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <span className="section-title-icon">{'// '}</span>
        <span className="section-title-text">{title}</span>
        <span className="section-title-line"></span>
      </motion.h2>
      {children}
    </motion.section>
  );
};

// GitHub highlights removed per user request.

export const Portfolio: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState<boolean>(() => {
    // Do not show splash during SSR (tests) to keep deterministic output
    if (typeof window === 'undefined') return false;
    return true;
  });
  
  // Force scroll to top on mount/refresh
  React.useEffect(() => {
    window.scrollTo(0, 0);
    // Prevent browser from restoring scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
  
  React.useEffect(() => {
    if (!showSplash) return;
    // Optimal timing: 3.5s total (1s typing + 2s read time + 0.5s fade)
    const t = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(t);
  }, [showSplash]);
  return (
    <div className="app">
      {showSplash && <SplashScreen />}
      {/* Hide main content until splash is done */}
      <div style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
      <ScrollProgress />
      <CursorTrail />
      <RippleEffect />
      <ParallaxSections />
      <ParticlesBackground />
      <FloatingIcons />
      <SectionRail />
      <QuickActionMenu />
      <Header />
      <Hero />
      <main>
        <Section id="experience" title="Experience">
          {experiences.map(exp => (
            <Card3D key={exp.company + exp.start} className="card experience-card">
              <div className="exp-flex">
                <div className="exp-info">
                  <header>
                    <h3>{exp.role} @ <span className="company">{exp.company}</span></h3>
                    <span className="dates">{exp.start} – {exp.end}</span>
                    <span className="location">{exp.location}</span>
                  </header>
                  <ul>
                    {exp.bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </div>
                {exp.logo && (
                  exp.company.toLowerCase().includes('microsoft') ? <MicrosoftLogo /> : <DFKILogo />
                )}
              </div>
            </Card3D>
          ))}
        </Section>
        <Section id="internships" title="Internships">
          {internships.map(exp => (
            <Card3D key={exp.company + exp.start} className="card internship-card">
              <div className="exp-flex">
                <div className="exp-info">
                  <header>
                    <h3>{exp.role} @ <span className="company">{exp.company}</span></h3>
                    <span className="dates">{exp.start} – {exp.end}</span>
                    <span className="location">{exp.location}</span>
                  </header>
                  <ul>
                    {exp.bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </div>
                {exp.logo && (
                  exp.company.toLowerCase().includes('microsoft') ? <MicrosoftLogo /> : <DFKILogo />
                )}
              </div>
            </Card3D>
          ))}
        </Section>
        <Section id="education" title="Education">
            {education.map(ed => (
              <Card3D key={ed.institution} className="card education-card">
                <div className="edu-flex">
                  <div className="edu-info">
                    <header>
                      <h3>{ed.degree}</h3>
                      <span className="institution">{ed.institution}</span>
                      <span className="dates">{ed.start} – {ed.end}</span>
                      <span className="location">{ed.location}</span>
                    </header>
                    {ed.notes && <ul>{ed.notes.map(n => <li key={n}>{n}</li>)}</ul>}
                  </div>
                  {ed.institution.toLowerCase().includes('german international university') && (
                    <GIULogo />
                  )}
                </div>
              </Card3D>
            ))}
        </Section>
        <Section id="skills" title="Skills">
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Programming</h3>
              <div className="pill-group">
                {skills.programming.map((s, idx) => (
                  <motion.span
                    key={s}
                    className="pill skill-pill"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h3>Miscellaneous</h3>
              <div className="pill-group">
                {skills.miscellaneous.map((s, idx) => (
                  <motion.span
                    key={s}
                    className="pill skill-pill"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </Section>
        <Section id="achievements" title="Achievements">
          {achievements.map(a => (
            <div key={a.title} className="card achievement">
              <header>
                <h3 className="achievement-title">
                  {a.icon && (
                    <span className="achievement-icon" aria-hidden="true">{a.icon}</span>
                  )}
                  <span className="achievement-text">{a.title}</span>
                  {a.icon && (
                    <span className="sr-only"> icon {a.icon}</span>
                  )}
                </h3>
              </header>
              <p>{a.description}</p>
              {a.links && <p className="links">{a.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>)}</p>}
            </div>
          ))}
        </Section>
        <Section id="projects" title="Projects">
              <ProjectTimeline />
        </Section>
        <Section id="contact" title="Contact">
          <div className="contact-links" aria-label="Contact links">
            <p className="contact-intro">Let's build something great together. Reach out via any channel below:</p>
            <ul className="contact-list">
              <li>
                <a href="tel:+201223729895" className="contact-link" aria-label="Call Ahmed" title="+20 122 372 9895">
                  <span className="icon" aria-hidden="true">📱</span>
                  <span>Phone</span>
                </a>
              </li>
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
    </div>
  );
};

// Vertical timeline for projects
const ProjectTimeline: React.FC = () => {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="timeline" aria-label="Projects timeline">
      <div className="timeline-line" aria-hidden="true" />
      {projects.map((p, idx) => {
        const theme = getProjectTheme(p);
        return (
          <motion.article
            key={p.name}
            className="timeline-item"
            initial={prefersReduced ? false : { opacity: 0, y: 32 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: prefersReduced ? 0 : idx * 0.05 }}
          >
            <div className="timeline-point" aria-hidden="true">
              <span className="tp-inner" style={{ background: theme.gradient }} />
            </div>
            <div className="timeline-date" aria-label={`Project dates ${p.start} to ${p.end}`}>{p.start} – {p.end}</div>
            <div className="timeline-content card project-card" data-animation={theme.animation}>
              <div className="project-icon" style={{ background: theme.gradient }}>
                {theme.icon}
              </div>
              <header>
                <h3 className="project-title">
                  <a href={p.url || '#'} target={p.url? '_blank':'_self'} rel="noreferrer" style={{ color: theme.color }}>
                    {p.name}
                  </a>
                </h3>
                <span className="sr-only" aria-label={`Dates: ${p.start} to ${p.end}`}>{p.start} – {p.end}</span>
              </header>
              <ul className="project-bullets">{p.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              <div className="stack-tags" aria-label="Technology stack">
                {p.stack.map(s => (
                  <span key={s} className="pill stack-pill" style={{ borderColor: theme.color }}>
                    <span className="tech-icon">{getTechIcon(s)}</span>
                    <span className="tech-name">{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        );
      })}
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
  const prefersReduced = useReducedMotion();
  
  return (
    <header className={`site-header ${transparent ? 'transparent' : ''} ${hide ? 'hide' : ''}`}>    
      <div className="brand">
        <motion.h1 
          className="glow brand-name"
          initial={prefersReduced ? false : { opacity: 0, x: -20 }}
          animate={prefersReduced ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="first-name">Ahmed</span>
          <span className="last-name">Osama</span>
        </motion.h1>
        <motion.p 
          className="tag brand-title"
          initial={prefersReduced ? false : { opacity: 0, x: -20 }}
          animate={prefersReduced ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="title-icon">{'{ '}</span>
          Software Engineer
          <span className="title-icon">{' }'}</span>
        </motion.p>
      </div>
      <Nav />
      <ThemeToggle />
    </header>
  );
};

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
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
  <TextReveal text="Software Engineer crafting resilient & performant products." className="hero-title" />
  <motion.p 
    className="hero-sub hero-subtitle-enhanced"
    initial={prefersReduced ? false : { opacity: 0, y: 20 }}
    animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }}
  >
    <span className="highlight-word">Focused</span> on <span className="highlight-word">clean architecture</span>, <span className="highlight-word">automation</span>, <span className="highlight-word">performance optimization</span> and <span className="highlight-word">developer experience</span>. I build <span className="highlight-word">reliable pipelines</span> and <span className="highlight-word">user-centric</span> full-stack applications.
  </motion.p>
        <RotatingTagline />
        <div className="hero-cta">
          <a href="#projects" className="btn primary">View Projects</a>
          <a href="mailto:ahmedosamadiab@gmail.com" className="btn secondary">Get in Touch</a>
        </div>
      </div>
    </motion.section>
  );
};

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const sections = ['experience','internships','education','skills','achievements','projects','contact'];
  
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="hamburger" 
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={isOpen ? 'open' : ''}>
        <ul>
          {sections.map(s => <li key={s}><a href={'#'+s} onClick={handleLinkClick}>{s}</a></li>)}
        </ul>
      </nav>
    </>
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

// Timed splash screen with dark theme variant
const SplashScreen: React.FC = () => {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [darkTheme, setDarkTheme] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const current = document.documentElement.dataset.theme || localStorage.getItem('theme') || 'light';
    setDarkTheme(current === 'dark');
  }, []);
  const fullTitle = 'Ahmed Osama';
  const fullSubLight = 'Software Engineer @ Microsoft';
  const fullSubDark = 'Software Engineer @ Microsoft — building in the dark 🌙';
  const fullSub = darkTheme ? fullSubDark : fullSubLight;
  const tagline = '✨ Crafting resilient & performant products';
  const [titleChars, setTitleChars] = React.useState(0);
  const [subChars, setSubChars] = React.useState(0);
  const [taglineChars, setTaglineChars] = React.useState(0);
  const [showContent, setShowContent] = React.useState(false);
  
  React.useEffect(() => {
    // Initial entry animation
    setTimeout(() => setShowContent(true), 100);
  }, []);
  
  React.useEffect(() => {
    if (prefersReduced) {
      setTitleChars(fullTitle.length);
      setSubChars(fullSub.length);
      setTaglineChars(tagline.length);
      return;
    }
    const start = performance.now();
    const titleDuration = 600;
    const subDuration = 500;
    const taglineDuration = 600;
    const typingTotal = titleDuration + subDuration + taglineDuration;
    const totalVisible = 3500;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < titleDuration) {
        const ratio = elapsed / titleDuration;
        setTitleChars(Math.min(fullTitle.length, Math.floor(ratio * fullTitle.length)));
      } else if (elapsed < titleDuration + subDuration) {
        setTitleChars(fullTitle.length);
        const subElapsed = elapsed - titleDuration;
        const subRatio = subElapsed / subDuration;
        setSubChars(Math.min(fullSub.length, Math.floor(subRatio * fullSub.length)));
      } else if (elapsed < typingTotal) {
        setTitleChars(fullTitle.length);
        setSubChars(fullSub.length);
        const taglineElapsed = elapsed - titleDuration - subDuration;
        const taglineRatio = taglineElapsed / taglineDuration;
        setTaglineChars(Math.min(tagline.length, Math.floor(taglineRatio * tagline.length)));
      } else {
        setTitleChars(fullTitle.length);
        setSubChars(fullSub.length);
        setTaglineChars(tagline.length);
      }
      
      if (elapsed < typingTotal) {
        requestAnimationFrame(tick);
      } else {
        setTitleChars(fullTitle.length);
        setSubChars(fullSub.length);
        setTaglineChars(tagline.length);
        const fadeStart = totalVisible - 500;
        setTimeout(() => {
          const root = document.querySelector('.splash');
          if (root) root.classList.add('splash-hide');
        }, fadeStart - elapsed);
      }
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced, fullSub, tagline]);
  
  return (
    <div className={`splash ${darkTheme ? 'dark-splash' : ''} ${showContent ? 'splash-visible' : ''}`} role="status" aria-label="Intro splash">
      <div className="splash-bg-orb splash-orb-1"></div>
      <div className="splash-bg-orb splash-orb-2"></div>
      <div className="splash-bg-orb splash-orb-3"></div>
      <div className="splash-inner">
        <div className="splash-logo">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" stroke="url(#gradient)" strokeWidth="2" className="splash-logo-circle"/>
            <text x="30" y="40" textAnchor="middle" fill="url(#gradient)" fontSize="28" fontWeight="bold" className="splash-logo-text">AO</text>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="60" y2="60">
                <stop offset="0%" stopColor="#2A5CAA"/>
                <stop offset="100%" stopColor="#5B8FCC"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="splash-title">
          {fullTitle.slice(0, titleChars)}
          {!prefersReduced && titleChars < fullTitle.length && <span className="caret" aria-hidden="true">|</span>}
        </h1>
        <p className="splash-sub">
          {fullSub.slice(0, subChars)}
          {!prefersReduced && subChars < fullSub.length && <span className="caret" aria-hidden="true">|</span>}
        </p>
        <p className="splash-tagline">
          {tagline.slice(0, taglineChars)}
          {!prefersReduced && taglineChars < tagline.length && <span className="caret" aria-hidden="true">|</span>}
        </p>
        <div className="splash-loader">
          <div className="splash-loader-bar"></div>
        </div>
      </div>
    </div>
  );
};

// Humorous rotating coding tagline
const RotatingTagline: React.FC = () => {
  const phrases = [
    'console.log("Hello, world ✨")',
    'while (coffee) { code(); }',
    'git commit -m "Make it faster"',
    'docker ps | grep inspiration',
    'const bug = feature?.notYet()',
    'npm run refactor --silent',
    '/* TODO: name this variable better */'
  ];
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [index, setIndex] = React.useState(0);
  const [display, setDisplay] = React.useState('');
  const [deleting, setDeleting] = React.useState(false);
  React.useEffect(() => {
    if (prefersReduced) return; // show static first phrase
    const full = phrases[index];
    const speed = deleting ? 24 : 42; // typing vs deleting speed
    const timeout = setTimeout(() => {
      if (!deleting) {
        // typing
        const nextLen = display.length + 1;
        setDisplay(full.slice(0, nextLen));
        if (nextLen === full.length) {
          // pause then start deleting
          setTimeout(() => setDeleting(true), 900);
        }
      } else {
        const nextLen = display.length - 1;
        setDisplay(full.slice(0, nextLen));
        if (nextLen === 0) {
          setDeleting(false);
          setIndex(i => (i + 1) % phrases.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [display, deleting, index, prefersReduced]);
  return (
    <div className="rotating-tagline" aria-live="polite">
      <code>{prefersReduced ? phrases[0] : display}<span className="rt-caret" aria-hidden="true">|</span></code>
    </div>
  );
};

// Scroll XP badge with celebration
const XPBadge: React.FC = () => {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Do not render on phones / narrow screens
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  if (isMobile) return null;
  const levels = [
    { name: 'Explorer', threshold: 0 },
    { name: 'Refactorer', threshold: 0.25 },
    { name: 'Optimizer', threshold: 0.50 },
    { name: 'Architect', threshold: 0.75 },
    { name: 'Legend', threshold: 0.92 }
  ];
  const [progress, setProgress] = React.useState(0);
  const [level, setLevel] = React.useState(levels[0].name);
  const [celebrate, setCelebrate] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setProgress(p);
      for (let i = levels.length - 1; i >= 0; i--) {
        if (p >= levels[i].threshold) { setLevel(levels[i].name); break; }
      }
      if (p >= 0.995 && !celebrate) setCelebrate(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [celebrate]);
  const percent = Math.round(progress * 100);
  // When celebration starts, schedule hide after animation (~3.2s confetti + buffer)
  React.useEffect(() => {
    if (celebrate && !hidden) {
      const t = setTimeout(() => setHidden(true), prefersReduced ? 1800 : 3800);
      return () => clearTimeout(t);
    }
  }, [celebrate, hidden, prefersReduced]);
  const message = !celebrate ? 'Keep scrolling to celebrate!' : '🎉 YOU made it!';
  if (hidden) return null;
  return (
    <div className={`xp-badge ${celebrate ? 'celebrate' : ''}`} aria-live="polite" aria-label={`Scroll progress ${percent}%`}>      
      <div className="xp-inner">
        <span className="xp-level">{level}</span>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${percent}%` }} /></div>
        <span className="xp-percent">{percent}%</span>
        <div className="xp-msg" aria-live="polite">{message}</div>
        {celebrate && !prefersReduced && (
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => <span key={i} className="piece" style={{ ['--ci' as any]: i }} />)}
          </div>
        )}
        {celebrate && prefersReduced && (
          <div className="celebrate-static" aria-hidden="true">🎉</div>
        )}
      </div>
    </div>
  );
};
