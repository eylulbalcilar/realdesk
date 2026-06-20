import { Protocol, Pool, ProtocolDetail } from './types';

type LlamaPool = {
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
