import { fetchProtocolDetail } from '@/lib/defillama';
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
import { ChainDistribution } from '@/components/chain-distribution';
import { RiskBreakdown } from '@/components/risk-breakdown';
import { ProtocolStats } from '@/components/protocol-stats';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(2)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(0)}K`;
  return `$${tvl.toLocaleString()}`;
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const protocol = await fetchProtocolDetail(id);

  if (!protocol) notFound();

  const risk = RISK_SCORES[id];
  const weightedScore = risk ? calculateWeightedRiskScore(risk.scores) : 0;
  const grade = risk ? getRiskGrade(weightedScore) : null;

  return (
    <main className="min-h-screen px-8 py-10 max-w-6xl mx-auto">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to overview
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{protocol.name}</h1>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{protocol.assetType}</Badge>
          <Badge variant="outline">{protocol.poolCount} pools</Badge>
          <Badge variant="outline">{protocol.chainCount} chains</Badge>
        </div>
      </div>

      <ProtocolStats
        tvl={protocol.tvl}
        apy={protocol.apy}
        grade={grade}
        weightedScore={weightedScore}
      />

      <div className="mb-8">
        <ChainDistribution pools={protocol.pools} />
      </div>

      {risk && <RiskBreakdown risk={risk} />}

      <h2 className="text-2xl font-semibold mb-4">Pools</h2>
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Chain</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">APY</TableHead>
              <TableHead className="text-right">TVL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocol.pools.map((p, i) => (
              <TableRow key={`${p.chain}-${p.symbol}-${i}`}>
                <TableCell>{p.chain}</TableCell>
                <TableCell className="font-medium">{p.symbol}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.apy.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatTVL(p.tvl)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
