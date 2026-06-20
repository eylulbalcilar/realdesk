import { RISK_WEIGHTS, RISK_DIMENSION_LABELS } from '@/lib/risk-scores';
import Link from 'next/link';

type DimensionKey = keyof typeof RISK_WEIGHTS;

const DIMENSION_DETAILS: Record<DimensionKey, { description: string; scoring: { score: number; criteria: string }[] }> = {
  collateral: {
    description: 'Quality and recoverability of the underlying assets backing the protocol.',
    scoring: [
      { score: 5, criteria: 'US Treasuries, sovereign bonds, fully cash-backed' },
      { score: 4, criteria: 'Investment-grade corporate credit, secured lending' },
      { score: 3, criteria: 'Senior private credit, mixed quality pools' },
      { score: 2, criteria: 'Mezzanine credit, subordinate tranches' },
      { score: 1, criteria: 'Unsecured emerging market credit, high-risk lending' },
    ],
  },
  smartContract: {
    description: 'Maturity and security of the on-chain code.',
    scoring: [
      { score: 5, criteria: '3+ audits from top firms, 2+ years deployed, $1M+ bug bounty' },
      { score: 4, criteria: '2+ audits, 1+ year deployed, active bounty program' },
      { score: 3, criteria: '1 audit, established codebase, no major incidents' },
      { score: 2, criteria: 'Single audit, older code, minor incidents' },
      { score: 1, criteria: 'Unaudited or significant security history' },
    ],
  },
  counterparty: {
    description: 'Risk profile of the borrowers, issuers, or other counterparties.',
    scoring: [
      { score: 5, criteria: 'KYC-verified institutional, regulated entities only' },
      { score: 4, criteria: 'KYC-verified corporate borrowers, credit-assessed' },
      { score: 3, criteria: 'Mixed pool, partially anonymous' },
      { score: 2, criteria: 'Anonymous with collateral requirements' },
      { score: 1, criteria: 'Anonymous unsecured, high concentration risk' },
    ],
  },
  regulatory: {
    description: 'Clarity and stability of the legal and regulatory framework.',
    scoring: [
      { score: 5, criteria: 'SEC-registered or MiCA-compliant, full disclosure' },
      { score: 4, criteria: 'Reg D / Reg S US, EU-regulated entity' },
      { score: 3, criteria: 'Offshore but with established compliance' },
      { score: 2, criteria: 'Gray regulatory zone, evolving framework' },
      { score: 1, criteria: 'Hostile or uncertain jurisdiction' },
    ],
  },
  transparency: {
    description: 'Visibility into protocol operations, asset backing, and performance.',
    scoring: [
      { score: 5, criteria: 'Real-time on-chain attestations, monthly public audits' },
      { score: 4, criteria: 'Monthly attestations, public quarterly reports' },
      { score: 3, criteria: 'Quarterly reports, partial on-chain data' },
      { score: 2, criteria: 'Annual reports only, limited disclosure' },
      { score: 1, criteria: 'Opaque operations, minimal reporting' },
    ],
  },
  liquidity: {
    description: 'Ease of exiting positions under normal and stressed conditions.',
    scoring: [
      { score: 5, criteria: 'Daily redemption, deep secondary market' },
      { score: 4, criteria: 'Weekly redemption, functional secondary market' },
      { score: 3, criteria: 'Monthly redemption, limited secondary market' },
      { score: 2, criteria: 'Quarterly redemption or lockup period' },
      { score: 1, criteria: 'No redemption, multi-year lockup' },
    ],
  },
  oracle: {
    description: 'Reliability of price and NAV reporting that drives protocol operations.',
    scoring: [
      { score: 5, criteria: 'Multiple independent oracles with on-chain proof' },
      { score: 4, criteria: 'Single trusted oracle with verified backup' },
      { score: 3, criteria: 'Centralized but transparent, regularly verified' },
      { score: 2, criteria: 'Self-reported with periodic audit' },
      { score: 1, criteria: 'Self-reported, no independent verification' },
    ],
  },
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← Back to overview
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Risk Scoring Methodology</h1>
        <p className="mt-2 text-muted-foreground">
            How Realdesk assesses risk across RWA protocols
        </p>
        </div>

      <section className="mb-12 space-y-4 text-sm leading-relaxed">
        <p>
          Realdesk scores each protocol across seven dimensions on a 1 to 5 scale, where 5 represents the lowest risk and 1 the highest. Dimension scores are combined using fixed weights to produce a single weighted score and letter grade.
        </p>
        <p>
          Scores are assigned manually based on public information, audit history, regulatory filings, and protocol documentation. They reflect a point-in-time assessment and are revised as material information becomes available.
        </p>
        <p>
          This is an analytical framework, not investment advice. Users should conduct their own due diligence before allocating capital.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Grading scale</h2>
        <div className="rounded-lg border divide-y">
          {[
            { grade: 'A', range: '4.50 - 5.00', label: 'Low Risk' },
            { grade: 'B', range: '3.50 - 4.49', label: 'Moderate Risk' },
            { grade: 'C', range: '2.50 - 3.49', label: 'Elevated Risk' },
            { grade: 'D', range: '1.50 - 2.49', label: 'High Risk' },
            { grade: 'F', range: '0.00 - 1.49', label: 'Very High Risk' },
          ].map((g) => (
            <div key={g.grade} className="flex items-center gap-4 p-4">
              <div className="text-2xl font-bold w-8">{g.grade}</div>
              <div className="flex-1">
                <div className="font-medium">{g.label}</div>
                <div className="text-sm text-muted-foreground">Weighted score {g.range}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Dimension weights</h2>
        <div className="rounded-lg border divide-y">
          {Object.entries(RISK_WEIGHTS).map(([key, weight]) => {
            const dimensionKey = key as DimensionKey;
            return (
              <div key={key} className="flex items-center justify-between p-4">
                <div className="font-medium">{RISK_DIMENSION_LABELS[dimensionKey]}</div>
                <div className="text-sm text-muted-foreground">{(weight * 100).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Dimension details</h2>
        {Object.entries(RISK_WEIGHTS).map(([key]) => {
          const dimensionKey = key as DimensionKey;
          const details = DIMENSION_DETAILS[dimensionKey];
          return (
            <div key={key} className="rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-2">{RISK_DIMENSION_LABELS[dimensionKey]}</h3>
              <p className="text-sm text-muted-foreground mb-4">{details.description}</p>
              <div className="space-y-2">
                {details.scoring.map((s) => (
                  <div key={s.score} className="flex gap-3 text-sm">
                    <div className="font-semibold w-8">{s.score}/5</div>
                    <div className="flex-1 text-muted-foreground">{s.criteria}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <p className="mt-12 text-xs text-muted-foreground">
        Last updated: methodology v1.0. Scores are reviewed quarterly or upon material protocol changes.
      </p>
    </main>
  );
}
