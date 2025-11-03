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

export const ICPCLogo: React.FC = () => (
  <div className="company-logo icpc-logo">
    <div className="icpc-letters">
      <span className="icpc-letter icpc-i">I</span>
      <span className="icpc-letter icpc-c">C</span>
      <span className="icpc-letter icpc-p">P</span>
      <span className="icpc-letter icpc-c2">C</span>
    </div>
    <div className="icpc-subtitle">International Collegiate Programming Contest</div>
  </div>
);

export const EOILogo: React.FC = () => (
  <div className="company-logo eoi-logo">
    <div className="eoi-letters">
      <span className="eoi-letter eoi-e">E</span>
      <span className="eoi-letter eoi-o">O</span>
      <span className="eoi-letter eoi-i">I</span>
    </div>
    <div className="eoi-subtitle">Egyptian Olympiad in Informatics</div>
  </div>
);

export const HackerCupLogo: React.FC = () => (
  <div className="company-logo hackercup-logo">
    <div className="hackercup-container">
      <div className="hackercup-word hacker-word">
        <span className="hacker-letter">H</span>
        <span className="hacker-letter">A</span>
        <span className="hacker-letter">C</span>
        <span className="hacker-letter">K</span>
        <span className="hacker-letter">E</span>
        <span className="hacker-letter">R</span>
      </div>
      <div className="hackercup-word cup-word">
        <span className="cup-letter">C</span>
        <span className="cup-letter">U</span>
        <span className="cup-letter">P</span>
      </div>
    </div>
    <div className="hackercup-subtitle">Meta Coding Competition</div>
  </div>
);
