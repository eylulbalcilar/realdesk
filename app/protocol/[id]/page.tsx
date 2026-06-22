import { fetchProtocolDetail, aggregateTVLByChain } from '@/lib/defillama';
import {
  RISK_SCORES,
  RISK_WEIGHTS,
  RISK_DIMENSION_LABELS,
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
import { ChainDistributionChart } from '@/components/charts/chain-distribution-chart';
import { formatUsd } from '@/lib/format';
import { notFound } from 'next/navigation';
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

function ScoreBar({ score }: { score: number }) {
  const percentage = (score / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right tabular-nums">
        {score}/5
      </span>
    </div>
  );
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const protocol = await fetchProtocolDetail(id);

  if (!protocol) notFound();

  const chainData = aggregateTVLByChain(protocol.pools);
  const risk = RISK_SCORES[id];
  const weightedScore = risk ? calculateWeightedRiskScore(risk.scores) : 0;
  const grade = risk ? getRiskGrade(weightedScore) : null;

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Back to overview
      </Link>

      <div className="mt-4 space-y-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{protocol.name}</h1>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{protocol.assetType}</Badge>
            <Badge variant="outline">{protocol.poolCount} pools</Badge>
            <Badge variant="outline">{protocol.chainCount} chains</Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Total TVL</div>
            <div className="text-2xl font-semibold mt-1 tabular-nums">
              {formatUsd(protocol.tvl)}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">
              Weighted Average APY
            </div>
            <div className="text-2xl font-semibold mt-1 tabular-nums">
              {protocol.apy.toFixed(2)}%
            </div>
          </div>
          {grade && (
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Risk Grade</div>
              <div className="flex items-baseline gap-3 mt-1">
                <div
                  className={`text-4xl font-bold leading-none ${getRiskColor(grade.letter)}`}
                >
                  {grade.letter}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>{grade.label}</div>
                  <div className="tabular-nums">{weightedScore.toFixed(2)} / 5.00</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Chain Distribution</h2>
          <div className="rounded-lg border p-4">
            <ChainDistributionChart data={chainData} />
          </div>
        </section>

        {risk && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Risk Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(RISK_WEIGHTS).map(([key, weight]) => {
                const dimensionKey = key as keyof typeof RISK_WEIGHTS;
                const score = risk.scores[dimensionKey];
                const label = RISK_DIMENSION_LABELS[dimensionKey];
                const rationale = risk.rationale[dimensionKey];

                return (
                  <div key={key} className="rounded-lg border p-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-semibold">{label}</h3>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        Weight: {(weight * 100).toFixed(0)}%
                      </span>
                    </div>
                    <ScoreBar score={score} />
                    <p className="text-sm text-muted-foreground mt-2">
                      {rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4">Pools</h2>
          <Table>
            <TableHeader>
              <TableRow>
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
                    {formatUsd(p.tvl)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </main>
  );
}
