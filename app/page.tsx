import { fetchProtocols } from '@/lib/defillama';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(0)}M`;
  return `$${tvl.toLocaleString()}`;
}

export default async function Home() {
  const protocols = await fetchProtocols();

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">RWA Protocols</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time comparison of yield, TVL, and risk across major RWA protocols
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protocol</TableHead>
            <TableHead>Asset Type</TableHead>
            <TableHead className="text-right">APY</TableHead>
            <TableHead className="text-right">TVL</TableHead>
            <TableHead className="text-right">Pools</TableHead>
            <TableHead className="text-right">Chains</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {protocols.map((p) => (
            <TableRow
              key={p.id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium">
                <Link href={`/protocol/${p.id}`} className="block">
                  {p.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{p.assetType}</Badge>
              </TableCell>
              <TableCell className="text-right">{p.apy.toFixed(2)}%</TableCell>
              <TableCell className="text-right">{formatTVL(p.tvl)}</TableCell>
              <TableCell className="text-right">{p.poolCount}</TableCell>
              <TableCell className="text-right">{p.chainCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-6 text-sm text-muted-foreground">
        Data from DeFiLlama. APY is TVL-weighted average across all pools.
      </p>
    </main>
  );
}
