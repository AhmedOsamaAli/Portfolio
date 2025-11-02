import { ProjectItem } from './data';

export interface ProjectTheme {
  icon: string;
  gradient: string;
  animation: 'float' | 'pulse' | 'spin' | 'bounce' | 'slide' | 'glow';
  color: string;
}

// Keyword matching for intelligent icon/theme selection
// Order matters: more specific matches should come first
const themeRules: Array<{ keywords: string[]; theme: ProjectTheme }> = [
  {
    keywords: ['metro', 'train', 'transport', 'cairo metro', 'railway', 'stations', 'routes'],
    theme: {
      icon: '🚇',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      animation: 'slide',
      color: '#43e97b'
    }
  },
  {
    keywords: ['portfolio', 'website', 'personal'],
    theme: {
      icon: '🎨',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      animation: 'float',
      color: '#667eea'
    }
  },
  {
    keywords: ['ecommerce', 'shop', 'store', 'cart', 'payment', 'checkout'],
    theme: {
      icon: '🛒',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      animation: 'bounce',
      color: '#f5576c'
    }
  },
  {
    keywords: ['portal', 'student', 'university', 'bachelor', 'academic', 'education', 'giu'],
    theme: {
      icon: '🏫',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      animation: 'glow',
      color: '#fa709a'
    }
  },
  {
    keywords: ['help desk', 'support', 'ticketing', 'chat', 'notification', 'messaging'],
    theme: {
      icon: '💬',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      animation: 'pulse',
      color: '#4facfe'
    }
  },
  {
    keywords: ['game', 'marvel', 'war', 'battle', 'character', 'player'],
    theme: {
      icon: '⚔️',
      gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
      animation: 'spin',
      color: '#ff0844'
    }
  },
  {
    keywords: ['api', 'backend', 'server', 'microservice'],
    theme: {
      icon: '🔧',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      animation: 'pulse',
      color: '#a8edea'
    }
  },
  {
    keywords: ['ai', 'ml', 'machine learning', 'neural', 'model'],
    theme: {
      icon: '🤖',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      animation: 'glow',
      color: '#d299c2'
    }
  },
  {
    keywords: ['mobile', 'ios', 'android', 'app'],
    theme: {
      icon: '📱',
      gradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
      animation: 'bounce',
      color: '#fddb92'
    }
  },
  {
    keywords: ['data', 'analytics', 'dashboard', 'visualization'],
    theme: {
      icon: '📊',
      gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      animation: 'pulse',
      color: '#e0c3fc'
    }
  }
];

// Tech stack icon mapping - comprehensive coverage
export const techIcons: Record<string, string> = {
  // Frontend Frameworks
  'React': '⚛️',
  'React.js': '⚛️',
  'Next.js': '▲',
  'Vue': '💚',
  'Vue.js': '💚',
  'Angular': '🅰️',
  'Svelte': '🔥',
  
  // Languages
  'TypeScript': '📘',
  'JavaScript': '📜',
  'Java': '☕',
  'Python': '🐍',
  'C++': '⚙️',
  'C#': '♯',
  'Go': '🔷',
  'Rust': '🦀',
  'PHP': '🐘',
  'Ruby': '💎',
  
  // Markup/Styling
  'HTML': '🌐',
  'CSS': '🎨',
  'SCSS': '🎨',
  'Sass': '🎨',
  'Tailwind': '💨',
  
  // Backend/Runtime
  'Node.js': '💚',
  'Node': '💚',
  'Express.js': '🚂',
  'Express': '🚂',
  'Nest.js': '🐱',
  'Nest': '🐱',
  'ASP.NET': '🔷',
  'Django': '🎸',
  'Flask': '🧪',
  'Spring': '🍃',
  
  // Databases
  'MongoDB': '🍃',
  'PostgreSQL': '🐘',
  'SQL': '💾',
  'MySQL': '🐬',
  'Redis': '🔴',
  'SQLite': '💿',
  'Oracle': '🔶',
  'Cassandra': '⚡',
  
  // DevOps/Tools
  'Docker': '🐳',
  'Kubernetes': '☸️',
  'Kafka': '📨',
  'RabbitMQ': '🐰',
  'Socket.IO': '🔌',
  'Vite': '⚡',
  'Webpack': '📦',
  'Vitest': '✅',
  'Jest': '🃏',
  'Git': '📂',
  'GitHub': '🐙',
  'GitLab': '🦊',
  'CI/CD': '🔄',
  
  // Cloud
  'AWS': '☁️',
  'Azure': '☁️',
  'GCP': '☁️',
  'Heroku': '💜',
  
  // Architecture/Patterns
  'Microservices': '🔗',
  'REST': '🌐',
  'GraphQL': '◼️',
  'OOP': '🎯',
  'API': '🔌',
  
  // UI Libraries
  'Swing': '🖼️',
  'Material-UI': '🎨',
  'Bootstrap': '🅱️',
  
  // Other
  'Game Logic': '🎮',
  'ML': '🤖',
  'AI': '🤖',
  'Blockchain': '⛓️'
};

export function getProjectTheme(project: ProjectItem): ProjectTheme {
  // Combine all searchable text
  const searchText = [
    project.name,
    ...project.bullets,
    ...project.stack
  ].join(' ').toLowerCase();

  // Find matching theme
  for (const rule of themeRules) {
    if (rule.keywords.some(keyword => searchText.includes(keyword))) {
      return rule.theme;
    }
  }

  // Default theme
  return {
    icon: '💡',
    gradient: 'linear-gradient(135deg, #2A5CAA 0%, #5B8FCC 100%)',
    animation: 'float',
    color: '#2A5CAA'
  };
}

export function getTechIcon(tech: string): string {
  return techIcons[tech] || '🔹';
}
