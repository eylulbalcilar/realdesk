'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Protocol } from '@/lib/types';
import {
  RISK_SCORES,
  RISK_WEIGHTS,
  RISK_DIMENSION_LABELS,
  calculateWeightedRiskScore,
  getRiskGrade,
} from '@/lib/risk-scores';
import { formatCompactUsd, gradeBadgeClass, scoreBarClass } from '@/lib/ui';

const MIN_SELECTED = 2;
const MAX_SELECTED = 4;

type DimensionKey = keyof typeof RISK_WEIGHTS;

function bestIndices(values: number[]): Set<number> {
  if (values.length === 0) return new Set();
  const max = Math.max(...values);
  const set = new Set<number>();
  values.forEach((value, i) => {
    if (value === max) set.add(i);
  });
  return set;
}

export function CompareView({ protocols }: { protocols: Protocol[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const available = protocols.map((p) => p.id);

  // The URL is the single source of truth for the selection.
  const raw = searchParams.get('protocols');
  let selected = (raw ? raw.split(',') : []).filter((id) =>
    available.includes(id)
  );
  if (selected.length < MIN_SELECTED) {
    selected = available.slice(0, MIN_SELECTED);
  }
  selected = selected.slice(0, MAX_SELECTED);

  const setSelection = (next: string[]) => {
    const params = new URLSearchParams();
    params.set('protocols', next.join(','));
    router.replace(`/compare?${params.toString()}`, { scroll: false });
  };

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length <= MIN_SELECTED) return;
      setSelection(selected.filter((x) => x !== id));
    } else {
      if (selected.length >= MAX_SELECTED) return;
      setSelection([...selected, id]);
    }
  };

  const columns = selected
    .map((id) => protocols.find((p) => p.id === id))
    .filter((p): p is Protocol => Boolean(p));

  const risk = columns.map((p) => {
    const scores = RISK_SCORES[p.id];
    const weighted = scores ? calculateWeightedRiskScore(scores.scores) : 0;
    const grade = scores ? getRiskGrade(weighted) : null;
    return { scores, weighted, grade };
  });

  const metricRows: {
    label: string;
    values: number[];
    render: (value: number) => string;
  }[] = [
    {
      label: 'APY',
      values: columns.map((p) => p.apy),
      render: (v) => `${v.toFixed(2)}%`,
    },
    {
      label: 'TVL',
      values: columns.map((p) => p.tvl),
      render: (v) => formatCompactUsd(v),
    },
    {
      label: 'Risk Score',
      values: risk.map((r) => r.weighted),
      render: (v) => v.toFixed(2),
    },
    {
      label: 'Pools',
      values: columns.map((p) => p.poolCount),
      render: (v) => `${v}`,
    },
    {
      label: 'Chains',
      values: columns.map((p) => p.chainCount),
      render: (v) => `${v}`,
    },
  ];

  const labelCell =
    'sticky left-0 z-10 bg-card px-4 py-3 text-left text-sm font-medium text-muted-foreground';

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="num mr-1 text-xs uppercase tracking-wider text-muted-foreground">
          Select 2 to 4
        </span>
        {protocols.map((p) => {
          const active = selected.includes(p.id);
          const lockedOff = !active && selected.length >= MAX_SELECTED;
          const lockedOn = active && selected.length <= MIN_SELECTED;
          const disabled = lockedOff || lockedOn;
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              disabled={disabled}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {active ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-auto rounded-xl border bg-card/80"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/70">
              <th className={`${labelCell} font-semibold`}>
                <span className="num text-[11px] uppercase tracking-wider">
                  Metric
                </span>
              </th>
              {columns.map((p) => (
                <th
                  key={p.id}
                  className="min-w-[150px] px-4 py-3 text-left align-top"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-xs font-bold text-primary ring-1 ring-primary/20">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-display font-semibold tracking-tight">
                        {p.name}
                      </span>
                    </div>
                    {selected.length > MIN_SELECTED && (
                      <button
                        onClick={() => toggle(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="mt-2 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {p.assetType}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Grade row */}
            <tr className="border-b border-border/60">
              <td className={labelCell}>Risk Grade</td>
              {risk.map((r, i) => {
                const isBest = bestIndices(risk.map((x) => x.weighted)).has(i);
                return (
                  <td
                    key={i}
                    className={`px-4 py-3 ${isBest ? 'bg-emerald-500/[0.06]' : ''}`}
                  >
                    {r.grade ? (
                      <span
                        className={`num inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-bold ${gradeBadgeClass(
                          r.grade.letter
                        )}`}
                      >
                        {r.grade.letter}
                        <span className="font-medium opacity-70">
                          {r.grade.label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Numeric metric rows */}
            {metricRows.map((row) => {
              const best = bestIndices(row.values);
              return (
                <tr key={row.label} className="border-b border-border/60">
                  <td className={labelCell}>{row.label}</td>
                  {row.values.map((value, i) => {
                    const isBest = best.has(i);
                    return (
                      <td
                        key={i}
                        className={`num px-4 py-3 tracking-tight ${
                          isBest
                            ? 'bg-emerald-500/[0.06] font-bold text-emerald-400'
                            : 'font-medium'
                        }`}
                      >
                        {row.render(value)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Section divider for risk dimensions */}
            <tr>
              <td
                colSpan={columns.length + 1}
                className="bg-muted/30 px-4 py-2"
              >
                <span className="num text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Risk Dimensions (1 worst, 5 best)
                </span>
              </td>
            </tr>

            {Object.keys(RISK_WEIGHTS).map((key) => {
              const dimension = key as DimensionKey;
              const values = risk.map((r) => r.scores?.scores[dimension] ?? 0);
              const best = bestIndices(values);
              return (
                <tr key={key} className="border-b border-border/60">
                  <td className={labelCell}>
                    {RISK_DIMENSION_LABELS[dimension]}
                  </td>
                  {values.map((score, i) => {
                    const isBest = best.has(i) && score > 0;
                    return (
                      <td
                        key={i}
                        className={`px-4 py-3 ${isBest ? 'bg-emerald-500/[0.06]' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${scoreBarClass(
                                score
                              )}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(score / 5) * 100}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                          <span
                            className={`num w-6 text-right text-xs ${
                              isBest
                                ? 'font-bold text-emerald-400'
                                : 'font-medium'
                            }`}
                          >
                            {score}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <p className="text-xs text-muted-foreground">
        Green highlights the leading protocol in each row. Risk grades and
        dimension scores reflect the Realdesk methodology.
      </p>
    </div>
  );
}
