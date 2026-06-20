export type Protocol = {
  id: string;
  name: string;
  assetType: string;
  apy: number;
  tvl: number;
  poolCount: number;
  chainCount: number;
};
export type Protocol = {
  id: string;
  name: string;
  assetType: string;
  apy: number;
  tvl: number;
  poolCount: number;
  chainCount: number;
};

export type Pool = {
  chain: string;
  symbol: string;
  apy: number;
  tvl: number;
};

export type ProtocolDetail = Protocol & {
  pools: Pool[];
};
