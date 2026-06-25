import React from 'react';
import './companyLogos.css';
import { Img } from './assets';
import {
  experiences,
  internships,
  education,
  skills,
  achievements,
  projects,
  openSource,
} from './data';
import {
  MicrosoftLogo,
  DFKILogo,
  GIULogo,
  ICPCLogo,
  EOILogo,
  HackerCupLogo,
  GSoCLogo,
} from './CompanyLogos';
import {
  Briefcase,
  Wrench,
  GraduationCap,
  Brain,
  Award,
  FolderGit2,
  GitFork,
  Mail,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  ArrowUpRight,
  Github,
  Linkedin,
  Phone,
  BookOpen,
  Terminal,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Section metadata (drives the sidebar + scroll-spy)
// ---------------------------------------------------------------------------
type SectionId =
  | 'experience'
  | 'internships'
  | 'opensource'
  | 'education'
  | 'skills'
  | 'achievements'
  | 'projects'
  | 'contact';

const sectionMeta: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
  { id: 'internships', label: 'Internships', icon: <Wrench size={16} /> },
  { id: 'opensource', label: 'Open Source', icon: <GitFork size={16} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={16} /> },
  { id: 'skills', label: 'Skills', icon: <Brain size={16} /> },
  { id: 'achievements', label: 'Achievements', icon: <Award size={16} /> },
  { id: 'projects', label: 'Projects', icon: <FolderGit2 size={16} /> },
  { id: 'contact', label: 'Contact', icon: <Mail size={16} /> },
];

// ---------------------------------------------------------------------------
// Theme toggle hook
// ---------------------------------------------------------------------------
function useTheme(): [boolean, () => void] {
  const [dark, setDark] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });
  React.useEffect(() => {
    const theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

// ---------------------------------------------------------------------------
// Scroll-spy for active sidebar item
// ---------------------------------------------------------------------------
function useActiveSection(): SectionId {
  const [active, setActive] = React.useState<SectionId>('experience');
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id') as SectionId | null;
            if (id) setActive(id);
          }
        });
      },
      { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    sectionMeta.forEach((m) => {
      const el = document.getElementById(m.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

// ---------------------------------------------------------------------------
// Top navigation bar
// ---------------------------------------------------------------------------
const TopNav: React.FC<{
  dark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}> = ({ dark, onToggleTheme, onToggleSidebar, sidebarOpen }) => (
  <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
    <div className="flex items-center gap-3">
      <button
        className="ph-btn ph-btn-ghost !p-2 md:hidden"
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-primary">
          <Terminal size={15} />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Ahmed Osama</div>
          <div className="font-mono text-[11px] text-muted">software_engineer</div>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        className="ph-btn ph-btn-ghost !p-2"
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={dark}
        onClick={onToggleTheme}
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <a
        href="mailto:ahmedosamadiab@gmail.com"
        className="ph-btn ph-btn-primary hidden sm:inline-flex"
      >
        <Mail size={15} />
        Get in touch
      </a>
    </div>
  </header>
);

// ---------------------------------------------------------------------------
// Sidebar navigation
// ---------------------------------------------------------------------------
const Sidebar: React.FC<{
  active: SectionId;
  open: boolean;
  onNavigate: () => void;
}> = ({ active, open, onNavigate }) => (
  <aside
    className={[
      'fixed inset-y-0 left-0 z-30 mt-14 w-60 shrink-0 border-r border-border bg-card px-3 py-4 transition-transform duration-200 md:sticky md:top-14 md:mt-0 md:h-[calc(100vh-3.5rem)] md:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full',
    ].join(' ')}
  >
    <nav aria-label="Section navigation" className="flex flex-col gap-1">
      <div className="px-2 pb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        Sections
      </div>
      {sectionMeta.map((m) => (
        <a
          key={m.id}
          href={`#${m.id}`}
          onClick={onNavigate}
          className={`ph-nav-link ${active === m.id ? 'active' : ''}`}
          aria-current={active === m.id ? 'true' : undefined}
        >
          <span className="ph-nav-indicator" aria-hidden="true" />
          <span className="text-muted-foreground/80">{m.icon}</span>
          <span>{m.label}</span>
        </a>
      ))}
    </nav>
    <div className="mt-6 border-t border-border pt-4">
      <div className="px-2 pb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        Links
      </div>
      <div className="flex flex-col gap-1">
        <a
          href="https://github.com/AhmedOsamaAli"
          target="_blank"
          rel="noreferrer"
          className="ph-nav-link"
        >
          <span className="ph-nav-indicator" aria-hidden="true" />
          <Github size={16} /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/ahmedosamadiab/"
          target="_blank"
          rel="noreferrer"
          className="ph-nav-link"
        >
          <span className="ph-nav-indicator" aria-hidden="true" />
          <Linkedin size={16} /> LinkedIn
        </a>
        <a
          href="https://ahmedosamaali.github.io/Blog/"
          target="_blank"
          rel="noreferrer"
          className="ph-nav-link"
        >
          <span className="ph-nav-indicator" aria-hidden="true" />
          <BookOpen size={16} /> Blog
        </a>
      </div>
    </div>
  </aside>
);

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
const Section: React.FC<{
  id: SectionId;
  title: string;
  kicker: string;
  children: React.ReactNode;
}> = ({ id, title, kicker, children }) => (
  <section id={id} className="scroll-mt-20 animate-fadeIn">
    <div className="mb-5">
      <div className="font-mono text-xs uppercase tracking-wider text-muted">
        {`// ${kicker}`}
      </div>
      <h2 className="mt-1 text-2xl font-bold">{title}</h2>
    </div>
    {children}
  </section>
);

// ---------------------------------------------------------------------------
// Window-style card (app-window aesthetic)
// ---------------------------------------------------------------------------
const WindowCard: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div className={`ph-card overflow-hidden ${className ?? ''}`}>
    {title && (
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
          <span className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
          <span className="h-2.5 w-2.5 rounded-full border border-border bg-primary" />
        </span>
        <span className="font-mono text-xs text-muted">{title}</span>
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

// ---------------------------------------------------------------------------
// Experience / internship entry
// ---------------------------------------------------------------------------
const RoleEntry: React.FC<{
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  logo?: string;
}> = ({ role, company, location, start, end, bullets, logo }) => (
  <WindowCard title={`${company.toLowerCase()}.role`}>
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold">
          {role} <span className="text-muted">@ {company}</span>
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="font-mono text-xs">
            {start} – {end}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {location}
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      {logo && (
        <div className="shrink-0">
          {company.toLowerCase().includes('microsoft') ? (
            <MicrosoftLogo />
          ) : (
            <DFKILogo />
          )}
        </div>
      )}
    </div>
  </WindowCard>
);

// ---------------------------------------------------------------------------
// Skills table (developer-tool dense table)
// ---------------------------------------------------------------------------
const skillGroupLabels: Record<keyof typeof skills, string> = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  databases: 'Databases',
  tools: 'Tools',
  cloud: 'Cloud',
};

const SkillsTable: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {(Object.keys(skills) as (keyof typeof skills)[]).map((group) => (
      <WindowCard key={group} title={`skills/${group}`}>
        <div className="mb-3 flex items-center gap-2">
          <Terminal size={15} className="text-primary" />
          <h3 className="text-base font-semibold">{skillGroupLabels[group]}</h3>
        </div>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {skills[group].map((s) => (
              <tr
                key={s.name}
                className="border-t border-border/70 transition-colors hover:bg-accent"
              >
                <td className="py-1.5 pr-3 font-mono text-xs text-muted">
                  {s.icon}
                </td>
                <td className="py-1.5 pr-3 font-medium">{s.name}</td>
                <td className="py-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-5 rounded-sm ${
                          i < (s.level ?? 0)
                            ? 'bg-primary'
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </WindowCard>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
const Hero: React.FC = () => (
  <section
    id="hero"
    className="relative mb-12 grid items-center gap-8 md:grid-cols-[1fr_auto]"
  >
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted">
        <span className="h-2 w-2 rounded-full bg-primary" />
        Available for new work
      </div>
      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
        Software Engineer crafting resilient &amp; performant products.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted">
        Focused on clean architecture, automation, performance optimization and
        developer experience. I build reliable pipelines and user-centric
        full-stack applications.
      </p>
      <pre className="ph-code mt-5 max-w-md">
        <span className="text-muted">$</span> whoami{'\n'}ahmed_osama ·
        software_engineer @ microsoft
      </pre>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="#projects" className="ph-btn ph-btn-primary">
          View projects <ArrowUpRight size={15} />
        </a>
        <a
          href="mailto:ahmedosamadiab@gmail.com"
          className="ph-btn ph-btn-secondary"
        >
          Get in touch
        </a>
      </div>
    </div>
    <div className="justify-self-center md:justify-self-end">
      <div className="group relative h-48 w-48 sm:h-56 sm:w-56">
        {/* Soft themed glow behind the avatar */}
        <div
          className="absolute -inset-3 rounded-full opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-50"
          style={{
            background:
              'radial-gradient(circle at 32% 30%, var(--primary), transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Gradient ring frame */}
        <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary via-primary/40 to-border p-[3px] shadow-subtle">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-card">
            <Img
              asset="headshot"
              className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
const Achievements: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {achievements.map((a) => {
      let Logo: React.FC | null = null;
      if (a.title.includes('ICPC')) Logo = ICPCLogo;
      else if (a.title.includes('EOI')) Logo = EOILogo;
      else if (a.title.includes('HackerCup')) Logo = HackerCupLogo;
      return (
        <WindowCard key={a.title}>
          <div className="mb-3 flex h-14 items-center">
            {Logo ? (
              <Logo />
            ) : (
              <span className="text-3xl" aria-hidden="true">
                {a.icon}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold">{a.title}</h3>
          <p className="mt-1 text-sm text-muted">{a.description}</p>
          {a.links && (
            <div className="mt-3 flex flex-wrap gap-2">
              {a.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ph-badge hover:border-primary"
                >
                  {l.label}
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          )}
        </WindowCard>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const Projects: React.FC = () => (
  <div className="grid gap-4 lg:grid-cols-2">
    {projects.map((p) => (
      <WindowCard key={p.name} title={p.name.toLowerCase().replace(/\s+/g, '_')}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">
            <a
              href={p.url || '#'}
              target={p.url ? '_blank' : '_self'}
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              {p.name}
              <ArrowUpRight size={15} />
            </a>
          </h3>
          <span className="shrink-0 font-mono text-xs text-muted">
            {p.start} – {p.end}
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {p.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="ph-tag">
              {s}
            </span>
          ))}
        </div>
      </WindowCard>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Open Source (GSoC)
// ---------------------------------------------------------------------------
const OpenSource: React.FC = () => (
  <div className="space-y-4">
    {openSource.map((o) => (
      <WindowCard key={o.name} title={o.name.toLowerCase()}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold">{o.name}</h3>
            <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
              <GitFork size={13} className="text-primary" />
              {o.program}
            </div>
            <ul className="mt-3 space-y-2">
              {o.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-foreground/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {o.stack.map((s) => (
                <span key={s} className="ph-tag">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {o.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ph-btn ph-btn-secondary !py-1.5 !text-xs"
                >
                  {l.label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </div>
          <div className="hidden shrink-0 sm:block">
            <GSoCLogo />
          </div>
        </div>
      </WindowCard>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
const contactLinks = [
  {
    href: 'tel:+201223729895',
    label: 'Phone',
    value: '+20 122 372 9895',
    icon: <Phone size={16} />,
  },
  {
    href: 'mailto:ahmedosamadiab@gmail.com',
    label: 'Email',
    value: 'ahmedosamadiab@gmail.com',
    icon: <Mail size={16} />,
  },
  {
    href: 'https://www.linkedin.com/in/ahmedosamadiab/',
    label: 'LinkedIn',
    value: 'in/ahmedosamadiab',
    icon: <Linkedin size={16} />,
    external: true,
  },
  {
    href: 'https://github.com/AhmedOsamaAli',
    label: 'GitHub',
    value: 'AhmedOsamaAli',
    icon: <Github size={16} />,
    external: true,
  },
  {
    href: 'https://ahmedosamaali.github.io/Blog/',
    label: 'Blog',
    value: 'ahmedosamaali.github.io/Blog',
    icon: <BookOpen size={16} />,
    external: true,
  },
];

const Contact: React.FC = () => (
  <WindowCard title="contact.sh">
    <p className="mb-4 text-sm text-muted">
      Let&apos;s build something great together. Reach out via any channel below:
    </p>
    <div className="grid gap-2 sm:grid-cols-2">
      {contactLinks.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.external ? '_blank' : undefined}
          rel={c.external ? 'noreferrer' : undefined}
          className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary hover:bg-accent"
        >
          <span className="text-primary">{c.icon}</span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">{c.label}</span>
            <span className="block truncate font-mono text-xs text-muted">
              {c.value}
            </span>
          </span>
        </a>
      ))}
    </div>
  </WindowCard>
);

// ---------------------------------------------------------------------------
// Animated site background (theme-aware, subtle motion)
// ---------------------------------------------------------------------------
const SiteBackground: React.FC = () => (
  <div className="ph-bg" aria-hidden="true">
    <div className="ph-bg-grid" />
    <div className="ph-bg-blob ph-bg-blob-1" />
    <div className="ph-bg-blob ph-bg-blob-2" />
    <div className="ph-bg-blob ph-bg-blob-3" />
  </div>
);

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export const Portfolio: React.FC = () => {
  const [dark, toggleTheme] = useTheme();
  const active = useActiveSection();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen">
      <SiteBackground />
      <TopNav
        dark={dark}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        sidebarOpen={sidebarOpen}
      />
      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar
          active={active}
          open={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:px-10">
          <div className="mx-auto max-w-4xl space-y-14">
            <Hero />

            <Section id="experience" title="Experience" kicker="work_history">
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <RoleEntry key={exp.company + exp.start} {...exp} />
                ))}
              </div>
            </Section>

            <Section
              id="internships"
              title="Internships"
              kicker="early_career"
            >
              <div className="space-y-4">
                {internships.map((exp) => (
                  <RoleEntry key={exp.company + exp.start} {...exp} />
                ))}
              </div>
            </Section>

            <Section
              id="opensource"
              title="Open Source"
              kicker="contributions"
            >
              <OpenSource />
            </Section>

            <Section id="education" title="Education" kicker="academics">
              <div className="space-y-4">
                {education.map((ed) => (
                  <WindowCard key={ed.institution} title="education.json">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold">{ed.degree}</h3>
                        <div className="mt-1 text-sm text-muted">
                          {ed.institution}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                          <span className="font-mono text-xs">
                            {ed.start} – {ed.end}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} /> {ed.location}
                          </span>
                        </div>
                        {ed.notes && (
                          <ul className="mt-3 space-y-2">
                            {ed.notes.map((n) => (
                              <li
                                key={n}
                                className="flex gap-2 text-sm text-foreground/90"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{n}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {ed.institution
                        .toLowerCase()
                        .includes('german international university') && (
                        <div className="shrink-0">
                          <GIULogo />
                        </div>
                      )}
                    </div>
                  </WindowCard>
                ))}
              </div>
            </Section>

            <Section id="skills" title="Skills" kicker="tech_stack">
              <SkillsTable />
            </Section>

            <Section
              id="achievements"
              title="Achievements"
              kicker="recognition"
            >
              <Achievements />
            </Section>

            <Section id="projects" title="Projects" kicker="selected_work">
              <Projects />
            </Section>

            <Section id="contact" title="Contact" kicker="get_in_touch">
              <Contact />
            </Section>

            <footer className="border-t border-border pt-6 text-center font-mono text-xs text-muted">
              &copy; {new Date().getFullYear()} Ahmed Osama · built with React +
              Tailwind
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portfolio;
