import React from 'react';
import './companyLogos.css';

export const MicrosoftLogo: React.FC = () => (
  <div className="company-logo microsoft-logo">
    <div className="ms-grid">
      <div className="ms-square ms-red"></div>
      <div className="ms-square ms-green"></div>
      <div className="ms-square ms-blue"></div>
      <div className="ms-square ms-yellow"></div>
    </div>
  </div>
);

export const DFKILogo: React.FC = () => (
  <div className="company-logo dfki-logo">
    <div className="dfki-text">
      <span className="dfki-letter">D</span>
      <span className="dfki-letter">F</span>
      <span className="dfki-letter">K</span>
      <span className="dfki-letter">I</span>
    </div>
    <div className="dfki-subtitle">German Research Center for Artificial Intelligence</div>
  </div>
);

export const GIULogo: React.FC = () => (
  <div className="company-logo giu-logo">
    <div className="giu-letters">
      <span className="giu-letter giu-g">G</span>
      <span className="giu-letter giu-i">I</span>
      <span className="giu-letter giu-u">U</span>
    </div>
    <div className="giu-subtitle">German International University</div>
  </div>
);
