import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Portfolio } from './Portfolio';

describe('Portfolio', () => {
  it('renders major sections', () => {
    const html = renderToString(<Portfolio />);
    expect(html).toContain('Experience');
    expect(html).toContain('Internships');
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

  it('includes company logos via Img component', () => {
    const html = renderToString(<Portfolio />);
    // At least one microsoft and one DFKI logo alt text
    expect(html).toContain('Microsoft logo');
    expect(html).toContain('DFKI logo');
  });
});
