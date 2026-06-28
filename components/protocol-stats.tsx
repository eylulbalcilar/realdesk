'use client';

import { motion } from 'framer-motion';
import { Layers, Percent, ShieldCheck } from 'lucide-react';
import { formatCompactUsd, gradeTextClass } from '@/lib/ui';

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
    {
      label: 'Total TVL',
      icon: Layers,
      content: <span className="num">{formatCompactUsd(tvl)}</span>,
    },
    {
      label: 'Weighted Avg APY',
      icon: Percent,
      content: <span className="num text-pos">{apy.toFixed(2)}%</span>,
    },
    {
      label: 'Risk Grade',
      icon: ShieldCheck,
      content: grade ? (
        <span className="flex items-baseline gap-2">
          <span className={`num ${gradeTextClass(grade.letter)}`}>
            {grade.letter}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {grade.label}{' '}
            <span className="num">({weightedScore.toFixed(2)})</span>
          </span>
        </span>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glow-hover group relative overflow-hidden rounded-xl border bg-card/80 p-5 hover:border-primary/50"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary/20" />
            <div className="flex items-center justify-between">
              <span className="num text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {card.label}
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/12 text-primary ring-1 ring-primary/20">
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
