'use client';

import { motion } from 'framer-motion';
import { AnimatedNumber } from './animated-number';

type Stat = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  sub?: string;
  format?: 'tvl';
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
    },
    {
      label: 'Avg APY',
      value: avgApy,
      decimals: 2,
      suffix: '%',
      sub: 'TVL-weighted',
    },
    { label: 'Protocols', value: protocolCount },
    { label: 'Total Pools', value: totalPools },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
          whileHover={{ y: -4 }}
          className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/50"
        >
          <div className="text-sm text-muted-foreground">{stat.label}</div>
          <div className="mt-1 text-2xl font-semibold">
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
      ))}
    </div>
  );
}
