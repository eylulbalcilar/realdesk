import { describe, it, expect } from 'vitest';
import {
  formatCompactUsd,
  gradeTextClass,
  gradeBadgeClass,
  scoreBarClass,
} from './ui';

describe('formatCompactUsd', () => {
  it('formats billions with two decimals', () => {
    expect(formatCompactUsd(2_500_000_000)).toBe('$2.50B');
  });

  it('formats millions with one decimal', () => {
    expect(formatCompactUsd(1_000_000)).toBe('$1.0M');
  });

  it('formats thousands with no decimals', () => {
    expect(formatCompactUsd(250_000)).toBe('$250K');
  });

  it('formats values below 1000 in full', () => {
    expect(formatCompactUsd(999)).toBe('$999');
  });
});

describe('grade styling helpers', () => {
  it('maps grade A to emerald accents', () => {
    expect(gradeTextClass('A')).toContain('emerald');
    expect(gradeBadgeClass('A')).toContain('emerald');
  });

  it('maps grade F to red accents', () => {
    expect(gradeTextClass('F')).toContain('red');
    expect(gradeBadgeClass('F')).toContain('red');
  });

  it('falls back for unknown grades', () => {
    expect(gradeTextClass('Z')).toBe('text-foreground');
  });
});

describe('scoreBarClass', () => {
  it('uses greener gradients for lower risk', () => {
    expect(scoreBarClass(5)).toContain('emerald');
    expect(scoreBarClass(1)).toContain('red');
  });
});
