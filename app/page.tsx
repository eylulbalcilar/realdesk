import { fetchProtocols } from '@/lib/defillama';
import { StatCards } from '@/components/stat-cards';
import { ProtocolTable } from '@/components/protocol-table';
import Link from 'next/link';

export default async function Home() {
  const protocols = await fetchProtocols();

  const totalTvl = protocols.reduce((sum, p) => sum + p.tvl, 0);
  const totalPools = protocols.reduce((sum, p) => sum + p.poolCount, 0);
  const weightedApy =
    totalTvl > 0
      ? protocols.reduce((sum, p) => sum + p.apy * p.tvl, 0) / totalTvl
      : 0;

  return (
    <main className="min-h-screen px-8 py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">RWA Protocols</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time comparison of yield, TVL, and risk across major RWA
          protocols
        </p>
      </div>

      <StatCards
        totalTvl={totalTvl}
        avgApy={weightedApy}
        protocolCount={protocols.length}
        totalPools={totalPools}
      />

      <ProtocolTable protocols={protocols} />

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
