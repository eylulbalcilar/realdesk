import { AnalystNote } from './types';

// Hand written, point-in-time analyst commentary that synthesizes the risk
// rationales in risk-scores.ts into a higher level view. Keyed by protocol slug.
export const ANALYST_NOTES: Record<string, AnalystNote> = {
  'ondo-yield-assets': {
    summary:
      'Ondo offers the cleanest collateral structure in the set, backed directly by short-term US Treasuries through BlackRock and PIMCO funds. The yield is modest and tracks short-term rates, but the credit risk sits close to the floor for any on-chain product. The binding constraint is flexibility, not safety: redemptions run on business hours and require KYC, so this is a vehicle for institutional allocators who value reporting and stability over composability.',
    lastUpdated: '2026-06-18',
    bullishPoints: [
      'Treasury-backed collateral with monthly attestations and public NAV reporting',
      'Reg D and Reg S structure gives the clearest regulatory standing in the set',
      'Daily mint and redeem during business hours for verified investors',
    ],
    bearishPoints: [
      'Yield is rate-dependent and compresses as short-term rates fall',
      'KYC gating and business-hours redemption limit DeFi composability',
    ],
  },
  maple: {
    summary:
      'Maple has matured into a credible on-chain private credit desk, with a multi-year track record and institutional borrowers that pass KYC and credit assessment. The trade-off is explicit: the higher yield is compensation for senior secured corporate lending, and capital can be locked while secondary liquidity stays thin. Treat it as a credit allocation rather than a cash equivalent, and size positions to the lockup you can actually tolerate.',
    lastUpdated: '2026-06-09',
    bullishPoints: [
      'Three-plus years deployed with multiple audits and no major contract failures',
      'Borrowers are KYC-verified and credit-assessed, with pool-level reporting',
    ],
    bearishPoints: [
      'Senior secured loans still carry borrower default risk, not Treasury-grade safety',
      'Lock-ups vary by pool and the secondary market is limited',
      'The yield is a spread over credit risk, not a risk-free rate',
    ],
  },
  'centrifuge-protocol': {
    summary:
      'Centrifuge is the most structurally interesting protocol here, tokenizing a mix of real-world assets across pools with strong EU and MiCA alignment and genuinely on-chain pool data. That breadth is also its main weakness: quality varies meaningfully by issuer, and junior tranches plus pool-specific lockups make exit the hardest part of the trade. It rewards investors who underwrite issuers one by one rather than treating the protocol as a single instrument.',
    lastUpdated: '2026-06-02',
    bullishPoints: [
      'Strong EU and MiCA regulatory alignment with public issuer documentation',
      'On-chain pool data and an established protocol history since 2020',
    ],
    bearishPoints: [
      'Collateral quality is issuer-dependent and uneven across pools',
      'Liquidity is the weakest dimension, with junior tranches and lockups limiting exit',
    ],
  },
  goldfinch: {
    summary:
      'Goldfinch takes the most aggressive position in the set, extending largely unsecured credit to emerging-market borrowers in pursuit of the highest headline yield. The return is real, but so is the tail: regional concentration, a history of security incidents, and lending in gray regulatory zones stack on top of each other. This is a high-conviction, small-allocation bet for investors who understand frontier credit, not a core RWA holding.',
    lastUpdated: '2026-04-21',
    bullishPoints: [
      'Highest headline yield in the set, with borrower-level data available',
    ],
    bearishPoints: [
      'Unsecured emerging-market credit carries elevated default risk',
      'Past security incidents and cross-border regulatory uncertainty',
      'Senior pool withdrawals are limited and backer positions are illiquid',
    ],
  },
};
