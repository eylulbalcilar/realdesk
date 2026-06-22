import { fetchProtocols } from '@/lib/defillama';
import {
  RISK_SCORES,
  calculateWeightedRiskScore,
  getRiskGrade,
} from '@/lib/risk-scores';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatUsd } from '@/lib/format';
import Link from 'next/link';

function getRiskColor(letter: string): string {
  switch (letter) {
    case 'A':
      return 'text-emerald-600';
    case 'B':
      return 'text-lime-600';
    case 'C':
      return 'text-amber-600';
    case 'D':
      return 'text-orange-600';
    case 'F':
      return 'text-red-600';
    default:
      return 'text-foreground';
  }
}

export default async function Home() {
  const protocols = await fetchProtocols();
  const sorted = [...protocols].sort((a, b) => b.tvl - a.tvl);

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">RWA Protocols</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time comparison of yield, TVL, and risk across major RWA protocols
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protocol</TableHead>
            <TableHead>Asset Type</TableHead>
            <TableHead className="text-right">APY</TableHead>
            <TableHead className="text-right">TVL</TableHead>
            <TableHead className="text-center">Risk Grade</TableHead>
            <TableHead className="text-right">Pools</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((p) => {
            const risk = RISK_SCORES[p.id];
            const weightedScore = risk
              ? calculateWeightedRiskScore(risk.scores)
              : 0;
            const grade = risk ? getRiskGrade(weightedScore) : null;
            const href = `/protocol/${p.id}`;

            return (
              <TableRow key={p.id} className="hover:bg-muted/50">
                <TableCell className="font-medium p-0">
                  <Link href={href} className="block px-4 py-3">
                    {p.name}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link href={href} className="block px-4 py-3">
                    <Badge variant="secondary">{p.assetType}</Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right p-0 tabular-nums">
                  <Link href={href} className="block px-4 py-3">
                    {p.apy.toFixed(2)}%
                  </Link>
                </TableCell>
                <TableCell className="text-right p-0 tabular-nums">
                  <Link href={href} className="block px-4 py-3">
                    {formatUsd(p.tvl)}
                  </Link>
                </TableCell>
                <TableCell className="text-center p-0">
                  <Link href={href} className="block px-4 py-3">
                    {grade && (
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-bold text-lg ${getRiskColor(grade.letter)}`}
                        >
                          {grade.letter}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {weightedScore.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </Link>
                </TableCell>
                <TableCell className="text-right p-0 tabular-nums">
                  <Link href={href} className="block px-4 py-3">
                    {p.poolCount}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-6 text-sm text-muted-foreground space-y-1">
        <p>
          Data from DeFiLlama. APY is TVL-weighted average across all pools.
        </p>
        <p>
          Risk grades reflect proprietary assessment across 7 dimensions.{' '}
          <Link href="/methodology" className="underline">
            View methodology
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
