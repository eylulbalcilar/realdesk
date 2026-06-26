'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Protocol } from '@/lib/types';
import {
  RISK_SCORES,
  calculateWeightedRiskScore,
  getRiskGrade,
} from '@/lib/risk-scores';

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
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(0)}M`;
  return `$${tvl.toLocaleString()}`;
}

export function ProtocolTable({ protocols }: { protocols: Protocol[] }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Protocol</TableHead>
            <TableHead>Asset Type</TableHead>
            <TableHead className="text-right">APY</TableHead>
            <TableHead className="text-right">TVL</TableHead>
            <TableHead className="text-center">Risk</TableHead>
            <TableHead className="text-right">Pools</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {protocols.map((p, i) => {
            const risk = RISK_SCORES[p.id];
            const weightedScore = risk
              ? calculateWeightedRiskScore(risk.scores)
              : 0;
            const grade = risk ? getRiskGrade(weightedScore) : null;

            return (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                className="border-b cursor-pointer transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
              >
                <TableCell className="font-medium">
                  <Link href={`/protocol/${p.id}`} className="block">
                    {p.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{p.assetType}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.apy.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatTVL(p.tvl)}
                </TableCell>
                <TableCell className="text-center">
                  {grade && (
                    <div className="flex flex-col items-center">
                      <span
                        className={`font-bold ${getRiskColor(grade.letter)}`}
                      >
                        {grade.letter}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {weightedScore.toFixed(2)}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.poolCount}
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
