import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  experiences,
  internships,
  education,
  skills,
  achievements,
  projects,
} from '../data';

const EASE_CUBIC = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: EASE_CUBIC },
  }),
};

const HERO_LINES = [
  'Building products people love.',
  'From Cairo to Berlin to the cloud.',
  'Code, caffeine, and curiosity.',
];

// ─── Hero Panel ────────────────────────────────────────────────────────────
export function HeroContent() {
  const [tagline, setTagline] = useState('');
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const full = HERO_LINES[lineIdx];
    const interval = setInterval(() => {
      setTagline(full.slice(0, i + 1));
      i++;
      if (i >= full.length) {
        clearInterval(interval);
        setTimeout(() => {
          setLineIdx(p => (p + 1) % HERO_LINES.length);
        }, 2200);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [lineIdx]);

  return (
    <div>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <div className="tw-hero-name">Ahmed Osama</div>
      </motion.div>
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
        <div className="tw-hero-role">🏢 Software Engineer · Microsoft Cairo</div>
      </motion.div>
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <div className="tw-hero-tagline">"{tagline}<span style={{ opacity: 0.5 }}>|</span>"</div>
      </motion.div>
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <div className="tw-hero-actions">
          <a
            href="https://drive.google.com/file/d/1MOiX2v4aVOExXB2dlO6EXUR3J5YRmSGr/view"
            target="_blank"
            rel="noreferrer"
            className="tw-hero-btn primary"
          >
            📄 Resume
          </a>
          <a href="https://github.com/AhmedOsamaAli" target="_blank" rel="noreferrer" className="tw-hero-btn secondary">
            GitHub ↗
          </a>
          <a href="https://linkedin.com/in/Ahmed-Osama-Ali" target="_blank" rel="noreferrer" className="tw-hero-btn secondary">
            LinkedIn ↗
          </a>
        </div>
      </motion.div>
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Years Exp', value: '2+' },
            { label: 'Projects', value: '6+' },
            { label: 'Technologies', value: '30+' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#64b4ff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(100,180,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Experience Panel ──────────────────────────────────────────────────────
export function ExperienceContent() {
  return (
    <div>
      {experiences.map((exp, i) => (
        <motion.div key={i} className="tw-card" custom={i} variants={fadeUp} initial="hidden" animate="visible"
          style={{ '--card-accent': 'linear-gradient(90deg, #0078d4, #50c0ff)' } as React.CSSProperties}>
          <div className="tw-card-title">
            <span style={{ color: '#0078d4' }}>🏢</span> {exp.role}
          </div>
          <div className="tw-card-meta">
            {exp.company} · {exp.location} · {exp.start} – {exp.end}
          </div>
          <ul className="tw-card-bullets">
            {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Internships Panel ─────────────────────────────────────────────────────
export function InternshipsContent() {
  return (
    <div>
      {internships.map((intern, i) => (
        <motion.div key={i} className="tw-card" custom={i} variants={fadeUp} initial="hidden" animate="visible"
          style={{ '--card-accent': i === 0 ? 'linear-gradient(90deg, #cc0000, #ff6666)' : 'linear-gradient(90deg, #0078d4, #50c0ff)' } as React.CSSProperties}>
          <div className="tw-card-title">
            {i === 0 ? '🔬 ' : '💼 '}{intern.role}
          </div>
          <div className="tw-card-meta">
            {intern.company} · {intern.location} · {intern.start} – {intern.end}
          </div>
          <ul className="tw-card-bullets">
            {intern.bullets.map((b, j) => <li key={j}>{b}</li>)}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Education Panel ───────────────────────────────────────────────────────
export function EducationContent() {
  return (
    <div>
      {education.map((edu, i) => (
        <motion.div key={i} className="tw-card" custom={i} variants={fadeUp} initial="hidden" animate="visible"
          style={{ '--card-accent': 'linear-gradient(90deg, #6c3fc7, #a87fff)' } as React.CSSProperties}>
          <div className="tw-edu-institution">🎓 {edu.institution}</div>
          <div className="tw-edu-degree">{edu.degree}</div>
          <div className="tw-card-meta">{edu.location} · {edu.start} – {edu.end}</div>
          {edu.notes?.map((n, j) => (
            <div key={j} className="tw-edu-note">🏅 {n}</div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Skills Panel ──────────────────────────────────────────────────────────
const categoryMeta: Record<string, { label: string; icon: string }> = {
  languages:  { label: 'Languages',  icon: '💻' },
  frameworks: { label: 'Frameworks', icon: '⚛️'  },
  databases:  { label: 'Databases',  icon: '🗄️'  },
  tools:      { label: 'Tools',      icon: '🔧'  },
  cloud:      { label: 'Cloud',      icon: '☁️'  },
};

export function SkillsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {(Object.keys(skills) as (keyof typeof skills)[]).map((cat, catIdx) => (
        <motion.div key={cat} custom={catIdx} variants={fadeUp} initial="hidden" animate="visible">
          <div style={{ fontSize: 12, color: 'rgba(100,180,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            {categoryMeta[cat].icon} {categoryMeta[cat].label}
          </div>
          <div className="tw-skills-grid">
            {skills[cat].map((s, i) => (
              <motion.div
                key={s.name}
                className="tw-skill-chip"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: catIdx * 0.08 + i * 0.04, duration: 0.3 }}
                style={{ borderColor: s.color + '44' }}
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
                {s.level && (
                  <span className="tw-skill-level">
                    {Array.from({ length: 5 }, (_, dot) => (
                      <span key={dot} className={`tw-skill-dot${dot < s.level! ? ' filled' : ''}`}
                        style={dot < s.level! ? { background: s.color } : {}} />
                    ))}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Achievements Panel ────────────────────────────────────────────────────
export function AchievementsContent() {
  return (
    <div>
      {achievements.map((ach, i) => (
        <motion.div key={i} className="tw-achievement" custom={i} variants={fadeUp} initial="hidden" animate="visible">
          <div className="tw-achievement-icon">{ach.icon}</div>
          <div>
            <div className="tw-achievement-title">{ach.title}</div>
            <div className="tw-achievement-desc">{ach.description}</div>
            {ach.links && (
              <div className="tw-achievement-links">
                {ach.links.map((l, j) => (
                  <a key={j} href={l.url} target="_blank" rel="noreferrer" className="tw-achievement-link">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Projects Panel ────────────────────────────────────────────────────────
export function ProjectsContent() {
  return (
    <div>
      {projects.map((proj, i) => (
        <motion.div key={i} className="tw-project" custom={i} variants={fadeUp} initial="hidden" animate="visible">
          <div className="tw-project-header">
            <div className="tw-project-name">🛠 {proj.name}</div>
            <div className="tw-project-dates">{proj.start} – {proj.end}</div>
          </div>
          <ul className="tw-project-bullets">
            {proj.bullets.slice(0, 3).map((b, j) => <li key={j}>{b}</li>)}
          </ul>
          <div className="tw-stack">
            {proj.stack.map((t) => <span key={t} className="tw-stack-tag">{t}</span>)}
          </div>
          <a href={proj.url} target="_blank" rel="noreferrer" className="tw-project-link">
            View on GitHub ↗
          </a>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Contact Panel ─────────────────────────────────────────────────────────
export function ContactContent() {
  const contacts = [
    { icon: '📧', label: 'Email', value: 'ahmed.o.ali01@gmail.com', href: 'mailto:ahmed.o.ali01@gmail.com' },
    { icon: '💼', label: 'LinkedIn', value: 'Ahmed-Osama-Ali', href: 'https://linkedin.com/in/Ahmed-Osama-Ali' },
    { icon: '', label: 'GitHub', value: 'AhmedOsamaAli', href: 'https://github.com/AhmedOsamaAli' },
    { icon: '📅', label: 'Schedule a Call', value: 'Book 30min', href: 'tel:+201001234567' },
  ];

  return (
    <div>
      <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible"
        style={{ fontSize: 14, color: 'rgba(200,220,255,0.65)', marginBottom: 24, lineHeight: 1.7 }}>
        Interested in working together? Reach out through any of these channels — I usually respond within 24 hours.
      </motion.p>
      <div className="tw-contact-grid">
        {contacts.map((c, i) => (
          <motion.a
            key={i}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="tw-contact-item"
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="tw-contact-icon">{c.icon}</div>
            <div>
              <div className="tw-contact-label">{c.label}</div>
              <div className="tw-contact-value">{c.value}</div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
