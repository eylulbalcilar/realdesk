import { Protocol, Pool, ProtocolDetail, HistoryPoint } from './types';

type LlamaPool = {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
};

const PROTOCOLS = {
  'ondo-yield-assets': { name: 'Ondo Finance', assetType: 'T-Bill' },
  'maple': { name: 'Maple Finance', assetType: 'Private Credit' },
  'centrifuge-protocol': { name: 'Centrifuge', assetType: 'Private Credit' },
  'goldfinch': { name: 'Goldfinch', assetType: 'EM Credit' },
} as const;

export async function fetchProtocols(): Promise<Protocol[]> {
  const res = await fetch('https://yields.llama.fi/pools', {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  const pools: LlamaPool[] = json.data;

  const relevant = pools.filter((p) => p.project in PROTOCOLS);

  const result: Protocol[] = Object.entries(PROTOCOLS).map(([slug, meta]) => {
    const protocolPools = relevant.filter((p) => p.project === slug);

    const totalTvl = protocolPools.reduce((sum, p) => sum + p.tvlUsd, 0);

    const weightedApy =
      totalTvl > 0
        ? protocolPools.reduce((sum, p) => sum + p.apy * p.tvlUsd, 0) / totalTvl
        : 0;

    const chains = new Set(protocolPools.map((p) => p.chain));

    return {
      id: slug,
      name: meta.name,
      assetType: meta.assetType,
      apy: weightedApy,
      tvl: totalTvl,
      poolCount: protocolPools.length,
      chainCount: chains.size,
    };
  });

  return result;
}

export async function fetchProtocolDetail(
  id: string
): Promise<ProtocolDetail | null> {
  if (!(id in PROTOCOLS)) return null;

  const res = await fetch('https://yields.llama.fi/pools', {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  const allPools: LlamaPool[] = json.data;

  const meta = PROTOCOLS[id as keyof typeof PROTOCOLS];
  const protocolPools = allPools.filter((p) => p.project === id);

  const pools: Pool[] = protocolPools
    .map((p) => ({
      chain: p.chain,
      symbol: p.symbol,
      apy: p.apy,
      tvl: p.tvlUsd,
    }))
    .sort((a, b) => b.tvl - a.tvl);

  const totalTvl = pools.reduce((sum, p) => sum + p.tvl, 0);
  const weightedApy =
    totalTvl > 0
      ? pools.reduce((sum, p) => sum + p.apy * p.tvl, 0) / totalTvl
      : 0;
  const chains = new Set(pools.map((p) => p.chain));

  return {
    id,
    name: meta.name,
    assetType: meta.assetType,
    apy: weightedApy,
    tvl: totalTvl,
    poolCount: pools.length,
    chainCount: chains.size,
    pools,
  };
}
export type ChainTVL = {
  name: string;
  value: number;
};

export function aggregateTVLByChain(pools: Pool[]): ChainTVL[] {
  const chainMap = new Map<string, number>();

  for (const pool of pools) {
    const current = chainMap.get(pool.chain) ?? 0;
    chainMap.set(pool.chain, current + pool.tvl);
  }

  return Array.from(chainMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// Historical data sources (verified against the live DeFiLlama API):
//   TVL: https://api.llama.fi/protocol/{slug} -> { tvl: [{ date, totalLiquidityUSD }] }
//   APY: https://yields.llama.fi/chart/{poolId} -> { data: [{ timestamp, apy, tvlUsd }] }
// The protocol slugs match the keys in PROTOCOLS, so no extra mapping is needed.
const HISTORY_DAYS = 90;
const DAY_SECONDS = 86_400;

type LlamaTvlPoint = {
  date: number;
  totalLiquidityUSD: number;
};

type LlamaChartPoint = {
  timestamp: string;
  apy: number | null;
  tvlUsd: number;
};

// Last 90 days of protocol-level TVL, one point per recorded day.
export async function fetchProtocolTvlHistory(
  slug: string
): Promise<HistoryPoint[]> {
  if (!(slug in PROTOCOLS)) return [];

  try {
    const res = await fetch(`https://api.llama.fi/protocol/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    const series: LlamaTvlPoint[] = Array.isArray(json.tvl) ? json.tvl : [];
    const cutoff = Date.now() / 1000 - HISTORY_DAYS * DAY_SECONDS;

    return series
      .filter((p) => p.date >= cutoff && typeof p.totalLiquidityUSD === 'number')
      .map((p) => ({
        date: new Date(p.date * 1000).toISOString().slice(0, 10),
        value: p.totalLiquidityUSD,
      }));
  } catch {
    return [];
  }
}

// Resolve the current largest pool for a protocol so we chart its APY history.
async function findLargestPoolId(slug: string): Promise<string | null> {
  const res = await fetch('https://yields.llama.fi/pools', {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const json = await res.json();
  const pools: LlamaPool[] = Array.isArray(json.data) ? json.data : [];
  const matching = pools.filter((p) => p.project === slug);
  if (matching.length === 0) return null;

  const largest = matching.reduce((a, b) => (b.tvlUsd > a.tvlUsd ? b : a));
  return largest.pool ?? null;
}

// Last 90 days of APY for the protocol's largest pool, downsampled to daily.
export async function fetchProtocolApyHistory(
  slug: string
): Promise<HistoryPoint[]> {
  if (!(slug in PROTOCOLS)) return [];

  try {
    const poolId = await findLargestPoolId(slug);
    if (!poolId) return [];

    const res = await fetch(`https://yields.llama.fi/chart/${poolId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    const data: LlamaChartPoint[] = Array.isArray(json.data) ? json.data : [];
    const cutoff = Date.now() - HISTORY_DAYS * DAY_SECONDS * 1000;

    // Chart data is chronological, so keeping the last reading per calendar day
    // yields a clean daily series in date order.
    const byDay = new Map<string, number>();
    for (const point of data) {
      if (point.apy == null) continue;
      const time = new Date(point.timestamp).getTime();
      if (Number.isNaN(time) || time < cutoff) continue;
      byDay.set(point.timestamp.slice(0, 10), point.apy);
    }

    return Array.from(byDay.entries()).map(([date, value]) => ({
      date,
      value,
    }));
  } catch {
    return [];
  }
}
