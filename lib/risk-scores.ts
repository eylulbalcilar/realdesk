import { ProtocolRisk } from './types';

export const RISK_WEIGHTS = {
  collateral: 0.25,
  smartContract: 0.20,
  counterparty: 0.15,
  regulatory: 0.15,
  transparency: 0.10,
  liquidity: 0.10,
  oracle: 0.05,
} as const;

export const RISK_DIMENSION_LABELS: Record<keyof typeof RISK_WEIGHTS, string> = {
  collateral: 'Collateral Quality',
  smartContract: 'Smart Contract Risk',
  counterparty: 'Counterparty Risk',
  regulatory: 'Regulatory Clarity',
  transparency: 'Transparency',
  liquidity: 'Liquidity Risk',
  oracle: 'Oracle / Pricing Risk',
};

export const RISK_SCORES: Record<string, ProtocolRisk> = {
  'ondo-yield-assets': {
    scores: {
      collateral: 5,
      smartContract: 4,
      counterparty: 5,
      liquidity: 4,
      regulatory: 5,
      transparency: 4,
      oracle: 4,
    },
    rationale: {
      collateral: 'Backed by short-term US Treasuries via BlackRock and PIMCO funds',
      smartContract: 'Multiple audits, 2+ years deployed, active bug bounty',
      counterparty: 'Fully KYC-verified institutional investors only',
      liquidity: 'Daily mint/redeem during business hours',
      regulatory: 'Reg D / Reg S registered, transparent legal structure',
      transparency: 'Monthly attestations, public NAV reporting',
      oracle: 'Centralized but transparent NAV, off-chain to on-chain bridge',
    },
  },
  'maple': {
    scores: {
      collateral: 3,
      smartContract: 4,
      counterparty: 4,
      liquidity: 3,
      regulatory: 3,
      transparency: 3,
      oracle: 3,
    },
    rationale: {
      collateral: 'Senior secured loans to institutional borrowers',
      smartContract: 'Multiple audits, 3+ years deployed, mature codebase',
      counterparty: 'KYC-verified institutional borrowers, credit-assessed',
      liquidity: 'Lock-up periods vary by pool, secondary market limited',
      regulatory: 'Operating across multiple jurisdictions, evolving framework',
      transparency: 'Quarterly borrower reports, pool-level dashboards',
      oracle: 'Pool delegate reported, third-party validated',
    },
  },
  'centrifuge-protocol': {
    scores: {
      collateral: 3,
      smartContract: 4,
      counterparty: 3,
      liquidity: 2,
      regulatory: 4,
      transparency: 4,
      oracle: 3,
    },
    rationale: {
      collateral: 'Tokenized real-world assets, varies by pool (invoices, real estate, treasuries)',
      smartContract: 'Multiple audits, established protocol since 2020',
      counterparty: 'Issuer-dependent, mixed quality across pools',
      liquidity: 'Pool-specific lockups, junior tranches less liquid',
      regulatory: 'Strong EU/MiCA alignment, issuer compliance framework',
      transparency: 'On-chain pool data, issuer documentation public',
      oracle: 'NAV updates by issuer, periodic verification',
    },
  },
  'goldfinch': {
    scores: {
      collateral: 2,
      smartContract: 3,
      counterparty: 2,
      liquidity: 2,
      regulatory: 2,
      transparency: 3,
      oracle: 2,
    },
    rationale: {
      collateral: 'Unsecured loans to emerging market borrowers, higher default risk',
      smartContract: 'Audited but has experienced security incidents historically',
      counterparty: 'EM credit facilities, regional concentration risk',
      liquidity: 'Senior pool withdrawals limited, backer positions illiquid',
      regulatory: 'Cross-border lending in gray regulatory zones',
      transparency: 'Borrower-level data available but inconsistent reporting',
      oracle: 'Self-reported loan performance, third-party auditor reviews',
    },
  },
};

export function calculateWeightedRiskScore(scores: ProtocolRisk['scores']): number {
  let total = 0;
  for (const [key, weight] of Object.entries(RISK_WEIGHTS)) {
    total += scores[key as keyof typeof scores] * weight;
  }
  return total;
}

export function getRiskGrade(weightedScore: number): {
  letter: string;
  label: string;
} {
  if (weightedScore >= 4.5) return { letter: 'A', label: 'Low Risk' };
  if (weightedScore >= 3.5) return { letter: 'B', label: 'Moderate Risk' };
  if (weightedScore >= 2.5) return { letter: 'C', label: 'Elevated Risk' };
  if (weightedScore >= 1.5) return { letter: 'D', label: 'High Risk' };
  return { letter: 'F', label: 'Very High Risk' };
}
