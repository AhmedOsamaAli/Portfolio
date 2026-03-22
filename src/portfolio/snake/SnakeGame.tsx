import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeroContent,
  ExperienceContent,
  InternshipsContent,
  EducationContent,
  SkillsContent,
  AchievementsContent,
  ProjectsContent,
  ContactContent,
} from './GemContent';
import './gemContent.css';
import './snakeGame.css';

// ─── Gem definitions ─────────────────────────────────────────────────────────
interface GemDef {
  id: string;
  label: string;
  icon: string;
  color: string;
  content: React.ReactNode;
  xRel: number; // 0..1 base position
  yRel: number;
}

const GEM_DEFS: GemDef[] = [
  { id: 'hero',         label: 'Hero',        icon: '🚀', color: '#64b4ff', content: <HeroContent />,         xRel: 0.50, yRel: 0.18 },
  { id: 'experience',  label: 'Experience',   icon: '🏢', color: '#2288ff', content: <ExperienceContent />,   xRel: 0.78, yRel: 0.28 },
  { id: 'internships', label: 'Internships',  icon: '🔬', color: '#cc3333', content: <InternshipsContent />,  xRel: 0.82, yRel: 0.60 },
  { id: 'education',   label: 'Education',    icon: '🎓', color: '#8855ff', content: <EducationContent />,    xRel: 0.62, yRel: 0.78 },
  { id: 'skills',      label: 'Skills',       icon: '⚡', color: '#00cc88', content: <SkillsContent />,       xRel: 0.35, yRel: 0.80 },
  { id: 'achievements',label: 'Achievements', icon: '🏆', color: '#ffaa22', content: <AchievementsContent />, xRel: 0.18, yRel: 0.60 },
  { id: 'projects',    label: 'Projects',     icon: '🛠',  color: '#ff6644', content: <ProjectsContent />,    xRel: 0.18, yRel: 0.30 },
  { id: 'contact',     label: 'Contact',      icon: '📡', color: '#44ffdd', content: <ContactContent />,      xRel: 0.35, yRel: 0.20 },
];

// ─── Gem drift (lazy-oscillation movement) ────────────────────────────────────
interface GemDrift {
  xRel: number;
  yRel: number;
  phaseX: number;
  phaseY: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
}

interface Spark {
  x: number; y: number; vx: number; vy: number;
  color: string; life: number; r: number;
}

function buildDrifts(): GemDrift[] {
  return GEM_DEFS.map(g => ({
    xRel:   g.xRel,
    yRel:   g.yRel,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    freqX:  0.20 + Math.random() * 0.18,
    freqY:  0.17 + Math.random() * 0.20,
    ampX:   24  + Math.random() * 28,
    ampY:   18  + Math.random() * 24,
  }));
}

const AVATAR_R   = 32;
const GEM_R      = 32;
const GEM_MARG_L = GEM_R + 185; // clear the left sidebar (~170px wide)
const GEM_MARG_R = GEM_R + 52;
const GEM_MARG_T = GEM_R + 70;  // clear top (radar/exit button area)
const GEM_MARG_B = GEM_R + 55;  // moderate bottom (no bar there anymore)
const COLL_DIST  = AVATAR_R + GEM_R - 6;
const SPEED      = 3.4;
const TRAIL_LEN  = 28;

// Module-level pure helper: compute gem pixel position at time t
function gemPos(drift: GemDrift, t: number, w: number, h: number) {
  const gx = drift.xRel * w + Math.sin(t * drift.freqX + drift.phaseX) * drift.ampX;
  const gy = drift.yRel * h + Math.sin(t * drift.freqY + drift.phaseY) * drift.ampY;
  return {
    x: Math.max(GEM_MARG_L, Math.min(w - GEM_MARG_R, gx)),
    y: Math.max(GEM_MARG_T, Math.min(h - GEM_MARG_B, gy)),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export interface SnakeGameProps {
  onExit?: () => void;
}

export function SnakeGame({ onExit }: SnakeGameProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const wrapRef      = useRef<HTMLDivElement>(null);
  const posRef       = useRef({ x: 400, y: 300 });
  const velRef       = useRef({ x: 0, y: 0 });
  const trailRef     = useRef<{ x: number; y: number }[]>([]);
  const keysRef      = useRef<Set<string>>(new Set());
  const collectedRef = useRef<Set<string>>(new Set());
  const rafRef       = useRef<number>(0);
  const sizeRef      = useRef({ w: 800, h: 600 });
  const driftsRef    = useRef<GemDrift[]>(buildDrifts());
  const starsRef     = useRef<{ x: number; y: number; r: number; a: number }[]>([]);
  const sparksRef    = useRef<Spark[]>([]);
  const activeGemRef = useRef<GemDef | null>(null);
  const lastGemRef        = useRef<GemDef | null>(null);  // last collected gem
  const modalOpenedAtRef  = useRef<number>(0);            // timestamp when modal was opened

  const [activeGem, setActiveGem] = useState<GemDef | null>(null);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [showHint, setShowHint]   = useState(true);
  const [victory, setVictory]     = useState(false);
  const [victoryFaded, setVictoryFaded] = useState(false);

  // Stamp the ref whenever activeGem is set so the keyboard handler can read it
  useEffect(() => {
    if (activeGem) modalOpenedAtRef.current = performance.now();
  }, [activeGem]);

  // Keep activeGemRef in sync
  activeGemRef.current = activeGem;

  // ── Avatar image ─────────────────────────────────────────────────────────
  // imgRef points to a hidden <img> in JSX — browser handles loading & caching

  // ── Close modal ────────────────────────────────────────────────────────────
  const closeModal = useCallback(() => setActiveGem(null), []);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const MOVE_KEYS = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','W','a','A','s','S','d','D'];
    const MIN_OPEN_MS = 700; // modal must be open this long before movement can dismiss it
    const dn = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
      if (e.key === 'Escape') { closeModal(); return; }
      // Movement dismisses modal only after minimum display time
      if (activeGemRef.current && MOVE_KEYS.includes(e.key)) {
        if (performance.now() - modalOpenedAtRef.current > MIN_OPEN_MS) closeModal();
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup',   up);
    };
  }, [closeModal]);

  // ── Hint fade ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // ── Resize ────────────────────────────────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width  = w;
    canvas.height = h;
    sizeRef.current = { w, h };
    if (posRef.current.x === 400 && posRef.current.y === 300) {
      posRef.current = { x: w / 2, y: h / 2 };
    }
    // Regenerate parallax star field
    starsRef.current = Array.from({ length: 130 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 0.5 + Math.random() * 1.5, a: 0.08 + Math.random() * 0.44,
    }));
  }, []);

  useEffect(() => {
    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [handleResize]);

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let then = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - then) / 16.67, 3);
      then = now;
      const t = now / 1000;

      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(loop); return; }
      const ctx = canvas.getContext('2d');
      if (!ctx)   { rafRef.current = requestAnimationFrame(loop); return; }

      const { w, h } = sizeRef.current;
      const pos  = posRef.current;
      const vel  = velRef.current;
      const keys = keysRef.current;

      // Input → velocity
      let ax = 0, ay = 0;
      if (keys.has('ArrowLeft')  || keys.has('a') || keys.has('A')) ax -= 1;
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) ax += 1;
      if (keys.has('ArrowUp')    || keys.has('w') || keys.has('W')) ay -= 1;
      if (keys.has('ArrowDown')  || keys.has('s') || keys.has('S')) ay += 1;
      if (ax !== 0 && ay !== 0) { ax *= 0.707; ay *= 0.707; }

      vel.x += (ax * SPEED - vel.x) * 0.18 * dt;
      vel.y += (ay * SPEED - vel.y) * 0.18 * dt;
      pos.x = Math.max(AVATAR_R, Math.min(w - AVATAR_R, pos.x + vel.x * dt));
      pos.y = Math.max(AVATAR_R, Math.min(h - AVATAR_R, pos.y + vel.y * dt));

      // Trail
      const trail = trailRef.current;
      trail.unshift({ x: pos.x, y: pos.y });
      if (trail.length > TRAIL_LEN) trail.length = TRAIL_LEN;

      // Gem collision — only uncollected gems can be triggered
      if (!activeGemRef.current) {
        for (let i = 0; i < GEM_DEFS.length; i++) {
          const gem = GEM_DEFS[i];
          if (collectedRef.current.has(gem.id)) continue; // already gone
          const { x: gx, y: gy } = gemPos(driftsRef.current[i], t, w, h);
          const dx = pos.x - gx, dy = pos.y - gy;
          if (Math.sqrt(dx * dx + dy * dy) < COLL_DIST) {
            const newSet = new Set(collectedRef.current).add(gem.id);
            collectedRef.current = newSet;
            setCollected(new Set(newSet));
            setActiveGem(gem);
            // All 8 collected — launch fireworks + show victory screen
            if (newSet.size === GEM_DEFS.length) {
              lastGemRef.current = gem; // remember for re-open after victory
              sparksRef.current = Array.from({ length: 140 }, (_, k) => {
                const angle = (k / 140) * Math.PI * 2;
                const spd   = 4 + Math.random() * 11;
                return { x: pos.x, y: pos.y,
                  vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 2.5,
                  color: GEM_DEFS[k % GEM_DEFS.length].color, life: 1, r: 2.5 + Math.random() * 3 };
              });
              // Show victory full-screen (close any open modal first)
              setTimeout(() => { setActiveGem(null); setVictory(true); }, 1400);
              // Auto-fade after 4 s, then re-open the last gem
              setTimeout(() => {
                setVictory(false);
                setVictoryFaded(true);
                setTimeout(() => setActiveGem(lastGemRef.current), 600); // wait for fade-out
              }, 1400 + 4000);
            }
            break;
          }
        }
      }

      // ── Draw ──────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // Parallax starfield — drifts opposite to avatar velocity
      for (const star of starsRef.current) {
        star.x -= vel.x * 0.03;
        star.y -= vel.y * 0.03;
        if (star.x < 0) star.x += w; else if (star.x > w) star.x -= w;
        if (star.y < 0) star.y += h; else if (star.y > h) star.y -= h;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,200,255,${star.a.toFixed(2)})`;
        ctx.fill();
      }

      // Gems — skip if already collected (they disappear)
      for (let i = 0; i < GEM_DEFS.length; i++) {
        const gem = GEM_DEFS[i];
        if (collectedRef.current.has(gem.id)) continue; // disappeared
        const { x: gx, y: gy } = gemPos(driftsRef.current[i], t, w, h);
        const pulse = 1 + Math.sin(t * 2.1 + i * 0.9) * 0.07;
        const r     = GEM_R * pulse;

        // Proximity alert — outer ring intensifies as avatar approaches
        const dxA = pos.x - gx, dyA = pos.y - gy;
        const near = Math.max(0, 1 - Math.sqrt(dxA * dxA + dyA * dyA) / 180);
        if (near > 0.06) {
          ctx.beginPath();
          ctx.arc(gx, gy, r + 14 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = gem.color + Math.round(near * 165).toString(16).padStart(2, '0');
          ctx.lineWidth   = 2 * near;
          ctx.stroke();
        }

        // Ambient glow
        const gGrd = ctx.createRadialGradient(gx, gy, r * 0.2, gx, gy, r * 2.6);
        gGrd.addColorStop(0, gem.color + '33');
        gGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = gGrd;
        ctx.beginPath(); ctx.arc(gx, gy, r * 2.6, 0, Math.PI * 2); ctx.fill();

        // Diamond body
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(t * 0.32 + i * 0.85);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.65, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r * 0.65, 0);
        ctx.closePath();
        const bGrd = ctx.createLinearGradient(-r, -r, r, r);
        bGrd.addColorStop(0, gem.color + '55');
        bGrd.addColorStop(1, gem.color + '22');
        ctx.fillStyle   = bGrd;
        ctx.strokeStyle = gem.color + '88';
        ctx.lineWidth   = 1.8;
        ctx.fill();
        ctx.stroke();
        // Inner facet lines
        ctx.strokeStyle = gem.color + '22';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-r * 0.65, 0); ctx.lineTo(r * 0.65, 0); ctx.stroke();
        ctx.restore();

        // Emoji icon on top
        ctx.font = `${r * 0.7}px serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(gem.icon, gx, gy);

        // Label beneath
        ctx.font      = `600 11px "Inter", sans-serif`;
        ctx.fillStyle = 'rgba(200,230,255,0.55)';
        ctx.textAlign = 'center';
        ctx.fillText(gem.label, gx, gy + r + 17);
      }

      // Trail glow
      for (let i = trail.length - 1; i >= 0; i--) {
        const alpha = (1 - i / TRAIL_LEN) * 0.38;
        const tr    = AVATAR_R * (1 - i / TRAIL_LEN) * 0.58;
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, tr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,180,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Avatar outer glow
      const aGrd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, AVATAR_R * 2.4);
      aGrd.addColorStop(0, 'rgba(100,180,255,0.25)');
      aGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = aGrd;
      ctx.beginPath(); ctx.arc(pos.x, pos.y, AVATAR_R * 2.4, 0, Math.PI * 2); ctx.fill();

      // Avatar face (circular clip) — drawn with canvas shapes, no image needed
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, AVATAR_R, 0, Math.PI * 2);
      ctx.clip();
      // Helmet background
      const helmGrd = ctx.createRadialGradient(pos.x - 6, pos.y - 8, 2, pos.x, pos.y, AVATAR_R);
      helmGrd.addColorStop(0, '#1a3a5c');
      helmGrd.addColorStop(1, '#071428');
      ctx.fillStyle = helmGrd;
      ctx.fillRect(pos.x - AVATAR_R, pos.y - AVATAR_R, AVATAR_R * 2, AVATAR_R * 2);
      // Visor (glassy ovoid)
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y - 2, AVATAR_R * 0.56, AVATAR_R * 0.45, 0, 0, Math.PI * 2);
      const visorGrd = ctx.createLinearGradient(pos.x - 14, pos.y - 18, pos.x + 10, pos.y + 12);
      visorGrd.addColorStop(0, 'rgba(100,210,255,0.55)');
      visorGrd.addColorStop(1, 'rgba(20,80,160,0.75)');
      ctx.fillStyle = visorGrd;
      ctx.fill();
      // Visor shine
      ctx.beginPath();
      ctx.ellipse(pos.x - 7, pos.y - 10, 7, 4, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fill();
      ctx.restore();

      // Avatar ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, AVATAR_R, 0, Math.PI * 2);
      ctx.strokeStyle = '#64b4ff';
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      // Pulsing outer aura ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, AVATAR_R + 5 + Math.sin(t * 3) * 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100,180,255,0.2)';
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Mini radar (top-right, shows directions to uncollected gems)
      const radarGems = GEM_DEFS.filter(g => !collectedRef.current.has(g.id));
      if (radarGems.length > 0) {
        const rcx = w - 74, rcy = 116, rr = 46;
        ctx.save();
        ctx.beginPath(); ctx.arc(rcx, rcy, rr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(4,9,20,0.78)'; ctx.fill();
        ctx.strokeStyle = 'rgba(100,180,255,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(rcx, rcy, rr * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(100,180,255,0.09)'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.strokeStyle = 'rgba(100,180,255,0.1)'; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(rcx - rr, rcy); ctx.lineTo(rcx + rr, rcy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rcx, rcy - rr); ctx.lineTo(rcx, rcy + rr); ctx.stroke();
        const sweep = (t % 2.5) / 2.5 * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(rcx, rcy); ctx.arc(rcx, rcy, rr - 2, sweep - 0.7, sweep); ctx.closePath();
        ctx.fillStyle = 'rgba(100,220,120,0.07)'; ctx.fill();
        const maxD = Math.sqrt(w * w + h * h) * 0.55;
        for (const gem of radarGems) {
          const gi = GEM_DEFS.findIndex(g => g.id === gem.id);
          const { x: gx, y: gy } = gemPos(driftsRef.current[gi], t, w, h);
          const dx = gx - pos.x, dy = gy - pos.y;
          const d  = Math.sqrt(dx * dx + dy * dy) || 1;
          const bd = Math.min(d / maxD, 1) * (rr - 9);
          const bp = 0.7 + Math.sin(t * 3 + gi) * 0.3;
          ctx.beginPath(); ctx.arc(rcx + (dx / d) * bd, rcy + (dy / d) * bd, 3 * bp, 0, Math.PI * 2);
          ctx.fillStyle = gem.color + 'cc'; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(rcx, rcy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#64b4ff'; ctx.fill();
        ctx.font = '8px "Inter", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(100,180,255,0.3)';
        ctx.fillText('RADAR', rcx, rcy + rr + 5);
        ctx.restore();
      }

      // Celebration sparks — continuous bursts while victory is active
      const aliveS: Spark[] = [];
      for (const s of sparksRef.current) {
        s.x += s.vx; s.y += s.vy;
        s.vy += 0.13; s.vx *= 0.97; s.vy *= 0.97;
        s.life -= 0.018;
        if (s.life > 0) {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
          ctx.fillStyle = s.color + Math.round(s.life * 230).toString(16).padStart(2, '0');
          ctx.fill(); aliveS.push(s);
        }
      }
      // While victory screen is shown keep spawning new bursts from random positions
      if (collectedRef.current.size === GEM_DEFS.length && aliveS.length < 200) {
        const bx = 0.2 * w + Math.random() * 0.6 * w;
        const by = 0.15 * h + Math.random() * 0.5 * h;
        for (let k = 0; k < 22; k++) {
          const angle = (k / 22) * Math.PI * 2;
          const spd   = 3 + Math.random() * 8;
          aliveS.push({ x: bx, y: by,
            vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 1.5,
            color: GEM_DEFS[Math.floor(Math.random() * GEM_DEFS.length)].color,
            life: 0.7 + Math.random() * 0.3, r: 2 + Math.random() * 2.5 });
        }
      }
      sparksRef.current = aliveS;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // no deps — all state via refs

  // ── Canvas click: revisit collected gems ──────────────────────────────────
  const onCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeGemRef.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx   = e.clientX - rect.left;
    const cy   = e.clientY - rect.top;
    const t    = performance.now() / 1000;
    const { w, h } = sizeRef.current;
    for (let i = 0; i < GEM_DEFS.length; i++) {
      const { x: gx, y: gy } = gemPos(driftsRef.current[i], t, w, h);
      const dx = cx - gx, dy = cy - gy;
      if (Math.sqrt(dx * dx + dy * dy) < GEM_R + 12 && collectedRef.current.has(GEM_DEFS[i].id)) {
        setActiveGem(GEM_DEFS[i]);
        return;
      }
    }
  }, []);

  const progress = `${collected.size} / ${GEM_DEFS.length}`;

  return (
    <div className="sg-root" ref={wrapRef}>
      {/* Hidden img so the browser loads/caches me.jpg; imgRef used by canvas draw */}
      <canvas ref={canvasRef} className="sg-canvas" onClick={onCanvasClick} />

      {/* Gem sidebar — fixed left column, always above all overlays (z-index: 65) */}
      <div className="sg-progress">
        <span className="sg-progress-label">Collected&nbsp;<strong>{progress}</strong></span>
        <div className="sg-gem-chips">
          {GEM_DEFS.map(g => {
            const done = collected.has(g.id);
            return (
              <div
                key={g.id}
                className={`sg-gem-chip${done ? ' collected' : ''}`}
                style={done ? { '--chip-color': g.color, borderColor: g.color + '66' } as React.CSSProperties : {}}
                title={done ? `Click to revisit ${g.label}` : g.label}
                onClick={() => done && setActiveGem(g)}
              >
                <span className="sg-gem-chip-icon">{g.icon}</span>
                <span className="sg-gem-chip-label">{g.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* HUD (exit + hint only) */}
      <div className="sg-hud">
        {onExit && (
          <button className="sg-exit" onClick={onExit}>↩ Back to portfolio</button>
        )}

        {showHint && (
          <div className="sg-hint">
            WASD / ← → ↑ ↓ &nbsp;·&nbsp; collect all 8 gems &nbsp;·&nbsp; move or Esc to dismiss &nbsp;·&nbsp; use the RADAR (top-right)
          </div>
        )}
      </div>

      {/* Gem modal */}
      <AnimatePresence>
        {activeGem && (
          <div className="sg-overlay" onClick={closeModal}>
            <motion.div
              className="sg-modal"
              initial={{ opacity: 0, scale: 0.88, y: 32 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={  { opacity: 0, scale: 0.93,  y: -18 }}
              transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ '--gem-color': activeGem.color } as React.CSSProperties}
              onClick={e => e.stopPropagation()}
            >
              <div className="sg-modal-header">
                <div className="sg-modal-icon">{activeGem.icon}</div>
                <div>
                  <div className="sg-modal-title">{activeGem.label}</div>
                  <div className="sg-modal-sub">Portfolio — gem collected</div>
                </div>
                <button className="sg-modal-close" onClick={closeModal}>✕</button>
              </div>
              <div className="sg-modal-body">{activeGem.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Victory screen — full-screen backdrop, covers everything */}
      <AnimatePresence>
        {victory && (
          <motion.div className="sg-victory"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            <motion.div className="sg-victory-card"
              initial={{ scale: 0.7, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 210, damping: 18 }}>
              <div className="sg-victory-trophy">🏆</div>
              <div className="sg-victory-title">All Gems Collected!</div>
              <div className="sg-victory-sub">You’ve explored the entire portfolio. Congratulations!</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Again pill — bottom-center, appears after victory card fades */}
      <AnimatePresence>
        {victoryFaded && (
          <motion.button
            className="sg-play-again"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={() => {
              collectedRef.current = new Set();
              setCollected(new Set());
              sparksRef.current = [];
              setActiveGem(null);
              setVictoryFaded(false);
            }}
          >
            🔄 Play Again
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
