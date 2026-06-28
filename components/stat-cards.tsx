'use client';

import { motion } from 'framer-motion';
import { Layers, Percent, Boxes, Database, type LucideIcon } from 'lucide-react';
import { AnimatedNumber } from './animated-number';

type Stat = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  sub?: string;
  icon: LucideIcon;
};

function formatTVLParts(tvl: number): {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
} {
  if (tvl >= 1_000_000_000)
    return { value: tvl / 1_000_000_000, decimals: 2, prefix: '$', suffix: 'B' };
  if (tvl >= 1_000_000)
    return { value: tvl / 1_000_000, decimals: 0, prefix: '$', suffix: 'M' };
  return { value: tvl, decimals: 0, prefix: '$', suffix: '' };
}

export function StatCards({
  totalTvl,
  avgApy,
  protocolCount,
  totalPools,
}: {
  totalTvl: number;
  avgApy: number;
  protocolCount: number;
  totalPools: number;
}) {
  const tvlParts = formatTVLParts(totalTvl);

  const stats: Stat[] = [
    {
      label: 'Total TVL',
      value: tvlParts.value,
      decimals: tvlParts.decimals,
      prefix: tvlParts.prefix,
      suffix: tvlParts.suffix,
      sub: 'Aggregate value locked',
      icon: Layers,
    },
    {
      label: 'Avg APY',
      value: avgApy,
      decimals: 2,
      suffix: '%',
      sub: 'TVL-weighted',
      icon: Percent,
    },
    {
      label: 'Protocols',
      value: protocolCount,
      sub: 'Tracked live',
      icon: Boxes,
    },
    {
      label: 'Total Pools',
      value: totalPools,
      sub: 'Across all chains',
      icon: Database,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="glow-hover group relative overflow-hidden rounded-xl border bg-card/80 p-5 hover:border-primary/50"
          >
            {/* corner accent wash */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:bg-primary/20" />

            <div className="flex items-center justify-between">
              <span className="num text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {stat.label}
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/12 text-primary ring-1 ring-primary/20">
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="num mt-3 text-2xl font-bold tracking-tight lg:text-3xl">
              <AnimatedNumber
                value={stat.value}
                decimals={stat.decimals ?? 0}
                prefix={stat.prefix ?? ''}
                suffix={stat.suffix ?? ''}
              />
            </div>
            {stat.sub && (
              <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
