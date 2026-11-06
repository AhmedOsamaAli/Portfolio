import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Portfolio } from './Portfolio';
import { profile, projects, skills } from './data';

describe('Portfolio', () => {
  it('renders major sections', () => {
    const html = renderToString(<Portfolio />);
    expect(html).toContain('Experience');
    expect(html).toContain('Education');
    expect(html).toContain('Skills');
    expect(html).toContain('Achievements');
    expect(html).toContain('Projects');
    expect(html).toContain('Contact');
  });

  it('includes hero headshot image with expected alt', () => {
    const html = renderToString(<Portfolio />);
    // Current hero image still uses placeholder headshot.svg with different alt text.
    // Ensure at least one headshot-like alt text is present.
    expect(html).toMatch(/alt="Ahmed Osama headshot"/);
  });

  it('includes company logos as custom components', () => {
    const html = renderToString(<Portfolio />);
    // Check for Microsoft logo (4 colored squares)
    expect(html).toContain('ms-square ms-red');
    expect(html).toContain('ms-square ms-blue');
    // Check for DFKI logo (DFKI letters)
    expect(html).toContain('dfki-letter');
    expect(html).toContain('German Research Center for Artificial Intelligence');
    // Check for GIU logo (GIU letters)
    expect(html).toContain('giu-letter');
    expect(html).toContain('German International University');
  });

  it('keeps the original hero, portrait, and projects layout', () => {
    const html = renderToString(<Portfolio />);
    expect(html).toContain('relative mb-12 grid items-center gap-8 md:grid-cols-[1fr_auto]');
    expect(html).toContain('group relative h-48 w-48 sm:h-56 sm:w-56');
    expect(html).toContain('grid gap-4 lg:grid-cols-2');
    expect(html).not.toContain('ph-hero-visual');
    expect(html).not.toContain('Filter projects');
  });

  it('uses canonical profile content without changing the existing controls', () => {
    const html = renderToString(<Portfolio />);
    expect(html).toContain(renderToString(<>{profile.headline}</>));
    expect(html).toContain(renderToString(<>{profile.bio}</>));
    expect(html).toContain(`href="mailto:${profile.email}"`);
    expect(html).toContain(`href="${profile.github}"`);
  });

  it('includes the resume-backed projects and corrected achievement', () => {
    const html = renderToString(<Portfolio />);
    expect(html).toContain('Threshold');
    expect(html).toContain('Walk-in');
    expect(html).toContain('DyeCast');
    expect(html).toContain('3x ICPC Regionalist');
    expect(projects.some((project) => project.name === 'Personal Blog')).toBe(true);
  });

  it('does not invent dates or proficiency for newly listed content', () => {
    const html = renderToString(<Portfolio />);
    expect(html).not.toContain('undefined');
    expect(projects.find((project) => project.name === 'Threshold')?.start).toBeUndefined();
    expect(skills.languages.find((skill) => skill.name === 'Go')?.level).toBeUndefined();
    expect(html).toContain('Listed');
  });
});
