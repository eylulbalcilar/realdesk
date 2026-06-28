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

export type HistoryPoint = {
  date: string;
  value: number;
};

export type ProtocolHistory = {
  tvl: HistoryPoint[];
  apy: HistoryPoint[];
};

export type AnalystNote = {
  summary: string;
  lastUpdated: string;
  bullishPoints?: string[];
  bearishPoints?: string[];
};
export type RiskDimension =
  | 'collateral'
  | 'smartContract'
  | 'counterparty'
  | 'liquidity'
  | 'regulatory'
  | 'transparency'
  | 'oracle';

export type RiskScores = {
  collateral: number;
  smartContract: number;
  counterparty: number;
  liquidity: number;
  regulatory: number;
  transparency: number;
  oracle: number;
};

export type ProtocolRisk = {
  scores: RiskScores;
  rationale: Record<RiskDimension, string>;
};
