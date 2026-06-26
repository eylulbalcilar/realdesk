'use client';

import { motion } from 'framer-motion';

function getRiskColor(letter: string): string {
  switch (letter) {
    case 'A':
      return 'text-emerald-500';
    case 'B':
      return 'text-lime-500';
    case 'C':
      return 'text-amber-500';
    case 'D':
      return 'text-orange-500';
    case 'F':
      return 'text-red-500';
    default:
      return 'text-foreground';
  }
}

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(2)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(0)}K`;
  return `$${tvl.toLocaleString()}`;
}

export function ProtocolStats({
  tvl,
  apy,
  grade,
  weightedScore,
}: {
  tvl: number;
  apy: number;
  grade: { letter: string; label: string } | null;
  weightedScore: number;
}) {
  const cards = [
    { label: 'Total TVL', content: formatTVL(tvl) },
    { label: 'Weighted Average APY', content: `${apy.toFixed(2)}%` },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -4 }}
          className="rounded-xl border bg-card p-4 transition-colors hover:border-primary/50"
        >
          <div className="text-sm text-muted-foreground">{card.label}</div>
          <div className="text-2xl font-bold tabular-nums">{card.content}</div>
        </motion.div>
      ))}
      {grade && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="rounded-xl border bg-card p-4 transition-colors hover:border-primary/50"
        >
          <div className="text-sm text-muted-foreground">Risk Grade</div>
          <div className="flex items-baseline gap-2">
            <div className={`text-2xl font-bold ${getRiskColor(grade.letter)}`}>
              {grade.letter}
            </div>
            <div className="text-sm text-muted-foreground">
              {grade.label} ({weightedScore.toFixed(2)})
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
