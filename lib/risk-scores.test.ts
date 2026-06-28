import { describe, it, expect } from 'vitest';
import {
  RISK_WEIGHTS,
  RISK_SCORES,
  calculateWeightedRiskScore,
  getRiskGrade,
} from './risk-scores';

describe('risk weights', () => {
  it('sum to exactly 1', () => {
    const total = Object.values(RISK_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1, 10);
  });
});

describe('calculateWeightedRiskScore', () => {
  const perfect = {
    collateral: 5,
    smartContract: 5,
    counterparty: 5,
    liquidity: 5,
    regulatory: 5,
    transparency: 5,
    oracle: 5,
  };
  const worst = {
    collateral: 1,
    smartContract: 1,
    counterparty: 1,
    liquidity: 1,
    regulatory: 1,
    transparency: 1,
    oracle: 1,
  };

  it('returns 5 when every dimension is 5', () => {
    expect(calculateWeightedRiskScore(perfect)).toBeCloseTo(5, 10);
  });

  it('returns 1 when every dimension is 1', () => {
    expect(calculateWeightedRiskScore(worst)).toBeCloseTo(1, 10);
  });

  it('matches the known weighted score for Ondo', () => {
    const score = calculateWeightedRiskScore(
      RISK_SCORES['ondo-yield-assets'].scores
    );
    expect(score).toBeCloseTo(4.55, 2);
  });
});

describe('getRiskGrade', () => {
  it('maps scores to the correct letter grade', () => {
    expect(getRiskGrade(5).letter).toBe('A');
    expect(getRiskGrade(4.5).letter).toBe('A');
    expect(getRiskGrade(4.49).letter).toBe('B');
    expect(getRiskGrade(3.5).letter).toBe('B');
    expect(getRiskGrade(2.5).letter).toBe('C');
    expect(getRiskGrade(1.5).letter).toBe('D');
    expect(getRiskGrade(1.49).letter).toBe('F');
    expect(getRiskGrade(0).letter).toBe('F');
  });
});
