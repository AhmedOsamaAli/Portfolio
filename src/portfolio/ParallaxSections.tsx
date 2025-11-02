import React from 'react';

export const ParallaxSections: React.FC = () => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Floating orbs with parallax */}
      <div className="parallax-orbs">
        <div 
          className="orb orb-1" 
          style={{ transform: `translate3d(0, ${scrollY * 0.1}px, 0)` }}
        />
        <div 
          className="orb orb-2" 
          style={{ transform: `translate3d(0, ${scrollY * -0.15}px, 0)` }}
        />
        <div 
          className="orb orb-3" 
          style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
        />
      </div>
    </>
  );
};
