import React, { useRef, MouseEvent } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const Card3D: React.FC<Card3DProps> = ({ children, className = '', intensity = 12 }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    
    // Calculate light position based on mouse
    const lightX = ((x / rect.width) * 100);
    const lightY = ((y / rect.height) * 100);

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
    card.style.setProperty('--mouse-x', `${lightX}%`);
    card.style.setProperty('--mouse-y', `${lightY}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
