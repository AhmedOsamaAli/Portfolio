import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Portfolio } from './Portfolio';

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
});
