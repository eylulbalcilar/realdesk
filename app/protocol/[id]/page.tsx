import {
  PROTOCOLS,
  fetchProtocolDetail,
  fetchProtocolTvlHistory,
  fetchProtocolApyHistory,
} from '@/lib/defillama';
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
import { HistoryChart } from '@/components/history-chart';
import { AnalystNote } from '@/components/analyst-note';
import { OnchainPanel } from '@/components/onchain-panel';
import { RiskBreakdown } from '@/components/risk-breakdown';
import { ProtocolStats } from '@/components/protocol-stats';
import { ANALYST_NOTES } from '@/lib/analyst-notes';
import { fetchProtocolOnchainData } from '@/lib/onchain';
import { formatCompactUsd, gradeBadgeClass } from '@/lib/ui';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Prerender only the known protocol pages and serve them from the CDN with
// hourly ISR. Unknown ids 404 at the edge (dynamicParams = false) instead of
// invoking a function, which keeps floods and scraping off the serverless tier
// and off the upstream DeFiLlama API.
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(PROTOCOLS).map((id) => ({ id }));
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const protocol = await fetchProtocolDetail(id);

  if (!protocol) notFound();

  const [tvlHistory, apyHistory, onchainTokens] = await Promise.all([
    fetchProtocolTvlHistory(id),
    fetchProtocolApyHistory(id),
    fetchProtocolOnchainData(id),
  ]);

  const risk = RISK_SCORES[id];
  const weightedScore = risk ? calculateWeightedRiskScore(risk.scores) : 0;
  const grade = risk ? getRiskGrade(weightedScore) : null;
  const note = ANALYST_NOTES[id];

  return (
    <main className="shell pt-8 pb-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to overview
      </Link>

      {/* Header */}
      <div className="mt-5 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/12 text-lg font-bold text-primary ring-1 ring-primary/25 glow-sm">
            {protocol.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {protocol.name}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {protocol.assetType}
              </span>
              <Badge variant="outline" className="num">
                {protocol.poolCount} pools
              </Badge>
              <Badge variant="outline" className="num">
                {protocol.chainCount} chains
              </Badge>
            </div>
          </div>
        </div>

        {grade && (
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${gradeBadgeClass(
              grade.letter
            )}`}
          >
            <span className="num text-3xl font-bold leading-none">
              {grade.letter}
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{grade.label}</div>
              <div className="num text-xs opacity-70">
                {weightedScore.toFixed(2)} / 5.00
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <ProtocolStats
          tvl={protocol.tvl}
          apy={protocol.apy}
          grade={grade}
          weightedScore={weightedScore}
        />
      </div>

      {note && (
        <div className="mb-8">
          <AnalystNote note={note} />
        </div>
      )}

      {onchainTokens.length > 0 && (
        <div className="mb-8">
          <OnchainPanel tokens={onchainTokens} />
        </div>
      )}

      <div className="mb-8">
        <HistoryChart tvl={tvlHistory} apy={apyHistory} />
      </div>

      <div className="mb-8">
        <ChainDistribution pools={protocol.pools} />
      </div>

      {risk && <RiskBreakdown risk={risk} />}

      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Pools
        </h2>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card/80">
        <Table>
          <TableHeader>
            <TableRow className="border-border/70 hover:bg-transparent">
              <TableHead className="num pl-5 text-[11px] uppercase tracking-wider text-muted-foreground">
                Chain
              </TableHead>
              <TableHead className="num text-[11px] uppercase tracking-wider text-muted-foreground">
                Symbol
              </TableHead>
              <TableHead className="num text-right text-[11px] uppercase tracking-wider text-muted-foreground">
                APY
              </TableHead>
              <TableHead className="num pr-5 text-right text-[11px] uppercase tracking-wider text-muted-foreground">
                TVL
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocol.pools.map((p, i) => (
              <TableRow
                key={`${p.chain}-${p.symbol}-${i}`}
                className="border-border/60 transition-colors hover:bg-primary/[0.04]"
              >
                <TableCell className="py-3 pl-5">
                  <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium">
                    {p.chain}
                  </span>
                </TableCell>
                <TableCell className="num font-medium">{p.symbol}</TableCell>
                <TableCell className="num text-right font-semibold text-pos">
                  {p.apy.toFixed(2)}%
                </TableCell>
                <TableCell className="num pr-5 text-right font-semibold tracking-tight">
                  {formatCompactUsd(p.tvl)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
