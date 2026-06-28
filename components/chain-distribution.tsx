'use client';

import { Pool } from '@/lib/types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCompactUsd } from '@/lib/ui';

// Violet / indigo led palette to match the accent system.
const COLORS = [
  '#8b5cf6',
  '#6366f1',
  '#a855f7',
  '#3b82f6',
  '#22d3ee',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#84cc16',
  '#f97316',
];

type ChainSlice = {
  chain: string;
  tvl: number;
  percentage: number;
};

export function ChainDistribution({ pools }: { pools: Pool[] }) {
  const totalTvl = pools.reduce((sum, p) => sum + p.tvl, 0);

  const chainMap = new Map<string, number>();
  for (const pool of pools) {
    chainMap.set(pool.chain, (chainMap.get(pool.chain) ?? 0) + pool.tvl);
  }

  const data: ChainSlice[] = Array.from(chainMap.entries())
    .map(([chain, tvl]) => ({
      chain,
      tvl,
      percentage: (tvl / totalTvl) * 100,
    }))
    .sort((a, b) => b.tvl - a.tvl);

  return (
    <div className="rounded-xl border bg-card/80 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
        <h3 className="font-display text-sm font-semibold tracking-tight">
          Chain Distribution
        </h3>
      </div>
      <div className="grid items-center gap-4 lg:grid-cols-[260px_1fr]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="tvl"
                nameKey="chain"
                cx="50%"
                cy="50%"
                outerRadius={92}
                innerRadius={56}
                paddingAngle={2}
                stroke="transparent"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.6rem',
                  fontSize: '12px',
                  color: 'var(--popover-foreground)',
                }}
                formatter={(value, _name, item) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  const payload = (item as { payload: ChainSlice }).payload;
                  return [
                    `${formatCompactUsd(numValue)} (${payload.percentage.toFixed(1)}%)`,
                    payload.chain,
                  ];
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={28}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown list with bars */}
        <div className="space-y-2.5">
          {data.map((slice, i) => (
            <div key={slice.chain} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="w-28 shrink-0 truncate text-sm font-medium">
                {slice.chain}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${slice.percentage}%`,
                    background: COLORS[i % COLORS.length],
                  }}
                />
              </div>
              <span className="num w-16 shrink-0 text-right text-sm font-semibold tracking-tight">
                {formatCompactUsd(slice.tvl)}
              </span>
              <span className="num w-12 shrink-0 text-right text-xs text-muted-foreground">
                {slice.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
