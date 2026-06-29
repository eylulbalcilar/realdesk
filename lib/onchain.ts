import { createPublicClient, http, fallback, erc20Abi, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { OnchainToken } from './types';

// Server-side public client. Uses two key-free public RPCs behind a fallback
// transport so a single endpoint going down does not break the read. Both were
// verified to serve Ondo token reads.
const client = createPublicClient({
  chain: mainnet,
  transport: fallback([
    http('https://ethereum-rpc.publicnode.com'),
    http('https://eth.drpc.org'),
  ]),
});

// Verified Ethereum mainnet token contracts, confirmed on-chain by reading
// symbol() (USDY and OUSG) rather than assuming the addresses.
const ONCHAIN_TOKENS: Record<
  string,
  { address: `0x${string}`; label: string }[]
> = {
  'ondo-yield-assets': [
    {
      address: '0x96F6eF951840721AdBF46Ac996b59E0235CB985C',
      label: 'US Dollar Yield',
    },
    {
      address: '0x1B19C19393e2d034D8Ff31ff34c81252FcBbee92',
      label: 'Short-Term US Gov Bond Fund',
    },
  ],
};

export function hasOnchainData(slug: string): boolean {
  return slug in ONCHAIN_TOKENS;
}

async function readToken(
  address: `0x${string}`,
  label: string
): Promise<OnchainToken | null> {
  try {
    const [symbol, decimals, totalSupply] = await Promise.all([
      client.readContract({ address, abi: erc20Abi, functionName: 'symbol' }),
      client.readContract({ address, abi: erc20Abi, functionName: 'decimals' }),
      client.readContract({
        address,
        abi: erc20Abi,
        functionName: 'totalSupply',
      }),
    ]);

    return {
      symbol,
      label,
      address,
      decimals,
      totalSupply: formatUnits(totalSupply, decimals),
    };
  } catch {
    // RPC failure or revert: skip this token rather than break the page.
    return null;
  }
}

export async function fetchProtocolOnchainData(
  slug: string
): Promise<OnchainToken[]> {
  const tokens = ONCHAIN_TOKENS[slug];
  if (!tokens) return [];

  const results = await Promise.all(
    tokens.map((token) => readToken(token.address, token.label))
  );
  return results.filter((token): token is OnchainToken => token !== null);
}
