'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { HistoryPoint } from '@/lib/types';
import { formatCompactUsd } from '@/lib/ui';

type Metric = 'tvl' | 'apy';

const METRICS: { key: Metric; label: string; color: string }[] = [
  { key: 'tvl', label: 'TVL', color: 'var(--primary)' },
  { key: 'apy', label: 'APY', color: 'var(--pos)' },
];

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatValue(value: number, metric: Metric): string {
  return metric === 'tvl' ? formatCompactUsd(value) : `${value.toFixed(2)}%`;
}

function ChartTooltip({
  active,
  payload,
  metric,
}: {
  active?: boolean;
  payload?: { payload: HistoryPoint }[];
  metric: Metric;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <div className="text-xs text-muted-foreground">{formatDate(point.date)}</div>
      <div className="num text-sm font-semibold">
        {formatValue(point.value, metric)}
      </div>
    </div>
  );
}

export function HistoryChart({
  tvl,
  apy,
}: {
  tvl: HistoryPoint[];
  apy: HistoryPoint[];
}) {
  const series: Record<Metric, HistoryPoint[]> = { tvl, apy };
  // Default to whichever metric has data.
  const [metric, setMetric] = useState<Metric>(tvl.length > 0 ? 'tvl' : 'apy');

  const active = series[metric];
  const color = METRICS.find((m) => m.key === metric)!.color;

  const hasData = active.length >= 2;
  const first = hasData ? active[0].value : 0;
  const last = hasData ? active[active.length - 1].value : 0;
  const pctChange = hasData && first !== 0 ? ((last - first) / first) * 100 : 0;
  const isUp = pctChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card/80 p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          <h3 className="font-display text-sm font-semibold tracking-tight">
            90-Day Trend
          </h3>
        </div>

        {/* Metric toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {METRICS.map((m) => {
            const isActive = m.key === metric;
            const disabled = series[m.key].length < 2;
            return (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                disabled={disabled}
                className={`num rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasData ? (
        <>
          {/* Current value + period change */}
          <div className="mb-4 flex items-end gap-3">
            <span className="num text-2xl font-bold tracking-tight">
              {formatValue(last, metric)}
            </span>
            <span
              className={`num mb-0.5 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                isUp
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}
            >
              {isUp ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {isUp ? '+' : ''}
              {pctChange.toFixed(2)}%
            </span>
            <span className="mb-1 text-xs text-muted-foreground">
              over 90 days
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={active}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id={`history-gradient-${metric}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  minTickGap={48}
                />
                <YAxis
                  width={52}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) =>
                    metric === 'tvl' ? formatCompactUsd(v) : `${v.toFixed(0)}%`
                  }
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                  content={<ChartTooltip metric={metric} />}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#history-gradient-${metric})`}
                  activeDot={{ r: 4, fill: color, stroke: 'var(--background)' }}
                  isAnimationActive
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No {metric.toUpperCase()} history available
          </p>
          <p className="text-xs text-muted-foreground">
            DeFiLlama does not report a historical series for this protocol.
          </p>
        </div>
      )}
    </motion.div>
  );
}
