import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAction {
  icon: string;
  label: string;
  action: () => void;
  color: string;
}

export const QuickActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const actions: QuickAction[] = [
    {
      icon: '📄',
      label: 'Download Resume',
      action: () => {
        window.open('https://drive.google.com/file/d/10-wfh2J8_vzNzY5xYNJFnmWdOB6dJTN_/view?usp=drive_link', '_blank');
      },
      color: '#2A5CAA',
    },
    {
      icon: '✉️',
      label: 'Send Email',
      action: () => {
        window.location.href = 'mailto:ahmedosamadiab@gmail.com';
      },
      color: '#3A6CB7',
    },
    {
      icon: '💼',
      label: 'View LinkedIn',
      action: () => {
        window.open('https://www.linkedin.com/in/ahmedosamadiab/', '_blank');
      },
      color: '#5B8FCC',
    },
    {
      icon: '💬',
      label: 'Schedule Call',
      action: () => {
        window.location.href = 'tel:+201223729895';
      },
      color: '#7BAFEE',
    },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      y: 20,
      opacity: 0,
      scale: 0.3,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="quick-action-menu">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="quick-actions-list"
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                className="quick-action-item"
                variants={itemVariants}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: action.color }}
                title={action.label}
              >
                <span className="quick-action-icon">{action.icon}</span>
                <span className="quick-action-label">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`quick-action-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isOpen ? '✕' : '⚡'}
      </motion.button>
    </div>
  );
};
