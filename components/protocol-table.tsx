'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Protocol } from '@/lib/types';
import {
  RISK_SCORES,
  calculateWeightedRiskScore,
  getRiskGrade,
} from '@/lib/risk-scores';
import { formatCompactUsd, gradeBadgeClass } from '@/lib/ui';

export function ProtocolTable({ protocols }: { protocols: Protocol[] }) {
  const maxTvl = Math.max(...protocols.map((p) => p.tvl), 1);

  return (
    <div className="glow-hover overflow-hidden rounded-xl border bg-card/80">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          <h2 className="font-display text-sm font-semibold tracking-tight">
            Protocol Comparison
          </h2>
        </div>
        <span className="num text-[11px] uppercase tracking-wider text-muted-foreground">
          {protocols.length} assets
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border/70 hover:bg-transparent">
            <TableHead className="num pl-5 text-[11px] uppercase tracking-wider text-muted-foreground">
              Protocol
            </TableHead>
            <TableHead className="num text-[11px] uppercase tracking-wider text-muted-foreground">
              Asset Type
            </TableHead>
            <TableHead className="num text-right text-[11px] uppercase tracking-wider text-muted-foreground">
              APY
            </TableHead>
            <TableHead className="num text-right text-[11px] uppercase tracking-wider text-muted-foreground">
              TVL
            </TableHead>
            <TableHead className="num text-center text-[11px] uppercase tracking-wider text-muted-foreground">
              Risk
            </TableHead>
            <TableHead className="num pr-5 text-right text-[11px] uppercase tracking-wider text-muted-foreground">
              Pools
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {protocols.map((p, i) => {
            const risk = RISK_SCORES[p.id];
            const weightedScore = risk
              ? calculateWeightedRiskScore(risk.scores)
              : 0;
            const grade = risk ? getRiskGrade(weightedScore) : null;
            const tvlShare = (p.tvl / maxTvl) * 100;

            return (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.08 }}
                className="group border-b border-border/60 transition-colors hover:bg-primary/[0.04]"
              >
                {/* Protocol name */}
                <TableCell className="py-3.5 pl-5">
                  <Link
                    href={`/protocol/${p.id}`}
                    className="flex items-center gap-3"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-xs font-bold text-primary ring-1 ring-primary/20">
                      {p.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-medium transition-colors group-hover:text-primary">
                      {p.name}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </TableCell>

                {/* Asset type pill (violet accent) */}
                <TableCell>
                  <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {p.assetType}
                  </span>
                </TableCell>

                {/* APY */}
                <TableCell className="num text-right font-semibold text-pos">
                  {p.apy.toFixed(2)}%
                </TableCell>

                {/* TVL with share bar */}
                <TableCell className="text-right">
                  <div className="num font-semibold tracking-tight">
                    {formatCompactUsd(p.tvl)}
                  </div>
                  <div className="ml-auto mt-1 h-1 w-24 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${tvlShare}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.5 + i * 0.08,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                </TableCell>

                {/* Risk grade pill */}
                <TableCell className="text-center">
                  {grade && (
                    <span
                      className={`num inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-bold ${gradeBadgeClass(
                        grade.letter
                      )}`}
                    >
                      {grade.letter}
                      <span className="font-medium opacity-70">
                        {weightedScore.toFixed(2)}
                      </span>
                    </span>
                  )}
                </TableCell>

                {/* Pools */}
                <TableCell className="num pr-5 text-right text-muted-foreground">
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
