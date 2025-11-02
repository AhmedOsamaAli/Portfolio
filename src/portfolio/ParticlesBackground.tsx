import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

const ParticlesBackground: React.FC = () => {
  const [init, setInit] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    // Watch for theme changes
    const checkTheme = () => {
      setIsDark(document.documentElement.dataset.theme === 'dark');
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const lightThemeOptions: ISourceOptions = {
    background: {
      opacity: 0
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          width: 1920,
          height: 1080
        }
      },
      color: {
        value: ['#2A5CAA', '#3A6CB7', '#1A4B99', '#5B8FCC']
      },
      shape: {
        type: ['circle', 'triangle', 'edge']
      },
      opacity: {
        value: { min: 0.1, max: 0.3 }
      },
      size: {
        value: { min: 2, max: 6 }
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out'
        }
      },
      links: {
        enable: true,
        distance: 150,
        color: '#2A5CAA',
        opacity: 0.15,
        width: 1
      }
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: true,
          mode: 'grab'
        },
        resize: {
          enable: true
        }
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.3
          }
        }
      }
    },
    detectRetina: true
  };

  const darkThemeOptions: ISourceOptions = {
    background: {
      opacity: 0
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          width: 1920,
          height: 1080
        }
      },
      color: {
        value: ['#4A7FD5', '#5B8FCC', '#6B9FDD', '#7BAFEE']
      },
      shape: {
        type: ['circle', 'triangle', 'star', 'polygon'],
        polygon: {
          sides: 6
        }
      },
      opacity: {
        value: { min: 0.2, max: 0.5 }
      },
      size: {
        value: { min: 2, max: 8 }
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out'
        }
      },
      links: {
        enable: true,
        distance: 180,
        color: '#4A7FD5',
        opacity: 0.25,
        width: 1.5
      }
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: true,
          mode: 'grab'
        },
        resize: {
          enable: true
        }
      },
      modes: {
        grab: {
          distance: 160,
          links: {
            opacity: 0.5
          }
        }
      }
    },
    detectRetina: true
  };

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={isDark ? darkThemeOptions : lightThemeOptions}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'auto'
      }}
    />
  );
};

export default ParticlesBackground;
