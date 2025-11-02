import React from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon: string;
  delay?: number;
}

const AnimatedCounter: React.FC<{ value: number; suffix?: string; prefix?: string }> = ({ 
  value, 
  suffix = '', 
  prefix = '' 
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * value);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatItem: React.FC<StatItemProps> = ({ value, label, suffix, prefix, icon, delay = 0 }) => {
  return (
    <motion.div
      className="stat-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">
          <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </motion.div>
  );
};

export const StatsCounter: React.FC = () => {
  // Calculate stats
  const yearsOfExperience = 5; // Approximate based on your experience
  const projectsCompleted = 25; // Based on your projects and work
  const technologiesMastered = 30; // Based on your skills list
  const linesOfCode = 100000; // Approximate LOC

  return (
    <div className="stats-dashboard">
      <motion.div
        className="stats-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <StatItem
          value={yearsOfExperience}
          suffix="+"
          label="Years Experience"
          icon="🚀"
          delay={0}
        />
        <StatItem
          value={projectsCompleted}
          suffix="+"
          label="Projects Completed"
          icon="✨"
          delay={0.1}
        />
        <StatItem
          value={technologiesMastered}
          suffix="+"
          label="Technologies"
          icon="💻"
          delay={0.2}
        />
        <StatItem
          value={linesOfCode}
          suffix="+"
          label="Lines of Code"
          icon="📝"
          delay={0.3}
        />
      </motion.div>
    </div>
  );
};
