import React, { useEffect, useRef } from 'react';

interface SkillNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
}

const SkillsConstellation: React.FC<{ skills: string[] }> = ({ skills }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<SkillNode[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initNodes();
    };

    const initNodes = () => {
      nodesRef.current = skills.map((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;
        return {
          x: canvas.width / 2 + Math.cos(angle) * radius,
          y: canvas.height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 8,
          label: skill
        };
      });
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodesRef.current.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 50 || node.x > canvas.width - 50) node.vx *= -1;
        if (node.y < 50 || node.y > canvas.height - 50) node.vy *= -1;

        // Gravity towards center
        const dx = canvas.width / 2 - node.x;
        const dy = canvas.height / 2 - node.y;
        node.vx += dx * 0.0001;
        node.vy += dy * 0.0001;

        // Damping
        node.vx *= 0.99;
        node.vy *= 0.99;
      });

      // Draw connections
      nodesRef.current.forEach((node, i) => {
        nodesRef.current.slice(i + 1).forEach(other => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            const opacity = (1 - distance / 200) * 0.3;
            ctx.strokeStyle = `rgba(42, 92, 170, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodesRef.current.forEach(node => {
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#2A5CAA';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#5B8FCC';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = '#2A5CAA';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 15);
      });

      requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [skills]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '18px',
        background: 'var(--glass)',
        backdropFilter: 'blur(14px)',
        border: '1px solid var(--border)'
      }}
    />
  );
};

export default SkillsConstellation;
