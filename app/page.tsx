import { fetchProtocols } from '@/lib/defillama';
import { StatCards } from '@/components/stat-cards';
import { ProtocolTable } from '@/components/protocol-table';
import { MarketTicker } from '@/components/market-ticker';
import { ArrowUpRight } from 'lucide-react';
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
    <main>
      {/* Hero */}
      <section className="shell pt-12 pb-8 lg:pt-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Real-World Asset Analytics
          </span>

          <h1 className="text-gradient font-display mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            RWA Protocol
            <br />
            Intelligence Terminal
          </h1>

          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Real-time comparison of yield, TVL, and proprietary risk grades
            across the leading real-world asset protocols. One desk, every
            number that matters.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="live-ring absolute inset-0 rounded-full bg-emerald-400" />
                <span className="live-dot relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live data from DeFiLlama
            </span>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1 text-foreground transition-colors hover:text-primary"
            >
              Risk methodology
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Full-bleed market ticker */}
      <MarketTicker protocols={protocols} />

      {/* Metrics + table */}
      <div className="shell space-y-6 pt-8 pb-10">
        <StatCards
          totalTvl={totalTvl}
          avgApy={weightedApy}
          protocolCount={protocols.length}
          totalPools={totalPools}
        />

        <ProtocolTable protocols={protocols} />

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Data from DeFiLlama. APY is the TVL-weighted average across all
            pools.
          </p>
          <p>
            Risk grades reflect a proprietary assessment across 7 dimensions.{' '}
            <Link
              href="/methodology"
              className="text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              View methodology
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
