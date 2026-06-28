'use client';

import { motion } from 'framer-motion';
import { RISK_WEIGHTS, RISK_DIMENSION_LABELS } from '@/lib/risk-scores';
import { ProtocolRisk } from '@/lib/types';
import { scoreBarClass } from '@/lib/ui';

function AnimatedScoreBar({ score, delay }: { score: number; delay: number }) {
  const percentage = (score / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${scoreBarClass(score)}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
      <span className="num w-9 text-right text-sm font-semibold">
        {score}/5
      </span>
    </div>
  );
}

export function RiskBreakdown({ risk }: { risk: ProtocolRisk }) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Risk Breakdown
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Object.entries(RISK_WEIGHTS).map(([key, weight], i) => {
          const dimensionKey = key as keyof typeof RISK_WEIGHTS;
          const score = risk.scores[dimensionKey];
          const label = RISK_DIMENSION_LABELS[dimensionKey];
          const rationale = risk.rationale[dimensionKey];

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glow-hover rounded-xl border bg-card/80 p-4 hover:border-primary/40"
            >
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <h3 className="font-medium">{label}</h3>
                <span className="num shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                  {(weight * 100).toFixed(0)}% weight
                </span>
              </div>
              <AnimatedScoreBar score={score} delay={i * 0.06 + 0.2} />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {rationale}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
