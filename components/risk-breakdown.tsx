'use client';

import { motion } from 'framer-motion';
import {
  RISK_WEIGHTS,
  RISK_DIMENSION_LABELS,
} from '@/lib/risk-scores';
import { ProtocolRisk } from '@/lib/types';

function AnimatedScoreBar({ score, delay }: { score: number; delay: number }) {
  const percentage = (score / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right tabular-nums">
        {score}/5
      </span>
    </div>
  );
}

export function RiskBreakdown({ risk }: { risk: ProtocolRisk }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Risk Breakdown</h2>
      <div className="space-y-4">
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
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-semibold">{label}</h3>
                <span className="text-xs text-muted-foreground">
                  Weight: {(weight * 100).toFixed(0)}%
                </span>
              </div>
              <AnimatedScoreBar score={score} delay={i * 0.08 + 0.2} />
              <p className="text-sm text-muted-foreground mt-2">{rationale}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
