import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { Portfolio } from './portfolio/Portfolio';

declare global {
	interface Window { __portfolio_idle?: boolean; }
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');
createRoot(rootEl).render(<Portfolio />);

// Register service worker for repeat-visit performance
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(() => {});
	});
}

// Defer non-critical decorative component mounting signal (optional global flag)
window.__portfolio_idle = false;
const triggerIdle = () => { window.__portfolio_idle = true; };
if ('requestIdleCallback' in window) {
	(window as any).requestIdleCallback(triggerIdle, { timeout: 3000 });
} else {
	setTimeout(triggerIdle, 1500);
}
