"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChainTVL } from "@/lib/defillama";
import { formatUsd } from '@/lib/format';

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];


type TooltipPayload = {
  name: string;
  value: number;
  payload: { percent: number };
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  const percent = (item.payload.percent * 100).toFixed(1);
  return (
    <div className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-md">
      <div className="font-medium">{item.name}</div>
      <div className="text-muted-foreground">
        {formatUsd(item.value)} ({percent}%)
      </div>
    </div>
  );
}

export function ChainDistributionChart({ data }: { data: ChainTVL[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No chain data available
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "0.875rem" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
