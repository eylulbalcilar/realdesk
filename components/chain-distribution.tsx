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

const COLORS = [
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#a855f7',
  '#14b8a6',
];

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(0)}K`;
  return `$${tvl.toLocaleString()}`;
}

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
    <div className="rounded-lg border p-6">
      <h3 className="font-semibold mb-4">Chain Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="tvl"
              nameKey="chain"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, item) => {
                const numValue = typeof value === 'number' ? value : 0;
                const payload = (item as { payload: ChainSlice }).payload;
                return [
                    `${formatTVL(numValue)} (${payload.percentage.toFixed(1)}%)`,
                    payload.chain,
                ];
                }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
