export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  logo?: string; // path in public
}

export interface InternshipItem extends ExperienceItem {}
export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  notes?: string[];
}
export interface SkillGroups {
  programming: string[];
  miscellaneous: string[];
}
export interface AchievementItem {
  title: string;
  description: string;
  links?: { label: string; url: string }[];
}
export interface ProjectItem {
  name: string;
  url: string;
  start: string;
  end: string;
  bullets: string[];
  stack: string[];
}

export const experiences: ExperienceItem[] = [
  {
    company: 'Microsoft',
    role: 'Software Engineer',
    location: 'Cairo, Egypt',
    start: 'Jul 2025',
    end: 'Present',
    bullets: [
      'Integrated a visual parity pipeline (Python + Bash) for automated UI checks in Clarity SDK.',
      'Resolved issues in Clarity JS release pipeline ensuring smooth automated deployment.',
      'Analyzed large-scale telemetry data across thousands of sites using ClickHouse; automated validation.',
      'Designed end-to-end benchmarking pipeline for Clarity web apps to evaluate performance across releases.'
    ],
    logo: 'ms1.png'
  }
];

export const internships: InternshipItem[] = [
  {
    company: 'DFKI',
    role: 'Software Engineering Intern',
    location: 'Berlin, Germany',
    start: 'Nov 2024',
    end: 'Apr 2025',
    bullets: [
      'Provided software architecture of DORIAN, a human-in-the-loop intelligent discovery assistant.',
      'Implemented core parts using Neo4j, NextJS, FastAPI.',
      'Implemented hybrid session management solution using Redis + MongoDB.'
    ],
    logo: 'dfki.png'
  },
  {
    company: 'Microsoft',
    role: 'Software Engineering Intern',
    location: 'Cairo, Egypt',
    start: 'Jul 2024',
    end: 'Sep 2024',
    bullets: [
      'Profiled & optimized background threads in Clarity SDK (Kotlin, Android).',
      'Built PoC for transitioning from WorkManager to JobScheduler.',
      'Identified & resolved 3 memory leaks via LeakCanary integration.',
      'Implemented baseline profiles improving runtime performance by 30%.'
    ],
    logo: 'ms1.png'
  }
];

export const education: EducationItem[] = [
  {
    institution: 'German International University',
    degree: "Bachelor's, Computer Science (Software Engineering, GPA: B+)",
    location: 'Cairo, Egypt',
    start: 'Sep 2021',
    end: 'Jun 2025',
    notes: ['Full scholarship for outstanding high school academic performance.']
  }
];

export const skills: SkillGroups = {
  programming: ['C/C++', 'Java', 'Kotlin', 'Python', 'JavaScript', 'SQL', 'C#', 'Node.js', 'React', 'MongoDB', 'Express'],
  miscellaneous: ['Linux', 'Git', 'Docker', 'Kafka', 'AWS', 'PostgreSQL', 'Bash']
};

export const achievements: AchievementItem[] = [
  {
    title: '2x ICPC Regionalist',
    description: 'Ranked 38th in Arab Collegiate Programming Contest among top 250 teams.',
    links: [
      { label: 'Ranking', url: 'https://drive.google.com/file/d/163BQmaXHslNyzkawH-5rsHrKFUDAnRV3/view?usp=sharing' },
      { label: 'ICPCID', url: 'https://icpc.global/ICPCID/V6C8EA1AECZP' }
    ]
  },
  {
    title: 'EOI Bronze Medalist',
    description: 'Bronze medal in Egyptian Olympiad in Informatics (EOI) 2020.'
  },
  {
    title: 'Meta HackerCup 2023',
    description: 'Reached top 1000 globally.',
    links: [
      { label: 'Certificate', url: 'https://drive.google.com/file/d/1QA3Rj7jMKdaYa92UbysGawWmfGp4uDn_/view' }
    ]
  }
];

export const projects: ProjectItem[] = [
  {
    name: 'Staff Help Desk Application',
    url: 'https://github.com/AhmedOsamaAli/Staff-Help-Desk',
    start: 'Jul 2023',
    end: 'Sep 2023',
    bullets: [
      'Streamlined support and ticketing processes for agents and users.',
      'Real-time notifications & chat using Socket.IO.',
      'Knowledge base feature for self-service issue resolution.',
      'MERN stack for scalability and responsiveness.'
    ],
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Socket.IO']
  },
  {
    name: 'Cairo Metro System',
    url: 'https://github.com/AhmedOsamaAli/Cairo-Metro-System',
    start: 'Mar 2023',
    end: 'Jun 2023',
    bullets: [
      'Web app for reserving & paying for metro tickets.',
      'Upcoming travel views and ticket management.',
      'Admin panel for stations, routes, modifications.',
      'PostgreSQL for efficient data storage & retrieval.'
    ],
    stack: ['PostgreSQL', 'Express.js', 'React.js', 'Node.js']
  }
  // Removed projects per user request: pixel art & question bank (not present in seed data).
  // If Cairo Metro System was meant to be removed, uncomment the block below to restore it.
];
