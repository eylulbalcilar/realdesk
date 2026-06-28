import { RISK_WEIGHTS, RISK_DIMENSION_LABELS } from '@/lib/risk-scores';
import { gradeBadgeClass } from '@/lib/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

const GRADES = [
  { grade: 'A', range: '4.50 - 5.00', label: 'Low Risk' },
  { grade: 'B', range: '3.50 - 4.49', label: 'Moderate Risk' },
  { grade: 'C', range: '2.50 - 3.49', label: 'Elevated Risk' },
  { grade: 'D', range: '1.50 - 2.49', label: 'High Risk' },
  { grade: 'F', range: '0.00 - 1.49', label: 'Very High Risk' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="h-5 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {children}
      </h2>
    </div>
  );
}

export default function MethodologyPage() {
  const maxWeight = Math.max(...Object.values(RISK_WEIGHTS));

  return (
    <main className="shell pt-8 pb-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to overview
      </Link>

      <div className="mt-5 mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Framework v1.0
        </span>
        <h1 className="font-display mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-gradient">Risk Scoring</span> Methodology
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Realdesk scores each protocol across seven dimensions on a 1 to 5
          scale, where 5 represents the lowest risk and 1 the highest. Dimension
          scores are combined using fixed weights to produce a single weighted
          score and letter grade.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Scores are assigned manually based on public information, audit
          history, regulatory filings, and protocol documentation. They reflect
          a point-in-time assessment and are revised as material information
          becomes available. This is an analytical framework, not investment
          advice.
        </p>
      </div>

      {/* Grading scale */}
      <section className="mb-12">
        <SectionTitle>Grading scale</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GRADES.map((g) => (
            <div
              key={g.grade}
              className={`rounded-xl border p-4 ${gradeBadgeClass(g.grade)}`}
            >
              <div className="num text-3xl font-bold leading-none">
                {g.grade}
              </div>
              <div className="mt-2 text-sm font-semibold">{g.label}</div>
              <div className="num mt-0.5 text-xs opacity-70">{g.range}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dimension weights */}
      <section className="mb-12">
        <SectionTitle>Dimension weights</SectionTitle>
        <div className="rounded-xl border bg-card/80 p-5">
          <div className="space-y-3.5">
            {Object.entries(RISK_WEIGHTS).map(([key, weight]) => {
              const dimensionKey = key as DimensionKey;
              return (
                <div key={key} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 text-sm font-medium">
                    {RISK_DIMENSION_LABELS[dimensionKey]}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                      style={{ width: `${(weight / maxWeight) * 100}%` }}
                    />
                  </div>
                  <span className="num w-12 shrink-0 text-right text-sm font-semibold">
                    {(weight * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dimension details */}
      <section>
        <SectionTitle>Dimension details</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(RISK_WEIGHTS).map(([key, weight]) => {
            const dimensionKey = key as DimensionKey;
            const details = DIMENSION_DETAILS[dimensionKey];
            return (
              <div
                key={key}
                className="glow-hover rounded-xl border bg-card/80 p-5 hover:border-primary/40"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {RISK_DIMENSION_LABELS[dimensionKey]}
                  </h3>
                  <span className="num shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                    {(weight * 100).toFixed(0)}% weight
                  </span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  {details.description}
                </p>
                <div className="space-y-2">
                  {details.scoring.map((s) => (
                    <div key={s.score} className="flex gap-3 text-sm">
                      <span className="num grid h-5 w-9 shrink-0 place-items-center rounded border border-border bg-muted/60 text-xs font-semibold">
                        {s.score}/5
                      </span>
                      <span className="flex-1 text-muted-foreground">
                        {s.criteria}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="num mt-12 text-xs text-muted-foreground">
        Last updated: methodology v1.0. Scores are reviewed quarterly or upon
        material protocol changes.
      </p>
    </main>
  );
}
