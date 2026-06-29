'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { OnchainToken } from '@/lib/types';
import { formatCompactNumber, shortenAddress } from '@/lib/ui';

export function OnchainPanel({ tokens }: { tokens: OnchainToken[] }) {
  if (tokens.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border bg-card/80 p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          <h3 className="font-display text-sm font-semibold tracking-tight">
            On-Chain Data
          </h3>
        </div>

        {/* Emphasize this is read straight from the chain, not DeFiLlama */}
        <span className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="live-ring absolute inset-0 rounded-full bg-emerald-400" />
            <span className="live-dot relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="num text-xs font-medium text-emerald-400">
            Live from Ethereum
          </span>
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tokens.map((token, i) => (
          <motion.div
            key={token.address}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
            className="rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {token.symbol}
              </span>
              <span className="text-xs text-muted-foreground">{token.label}</span>
            </div>

            <div className="mt-3">
              <div className="num text-2xl font-bold tracking-tight">
                {formatCompactNumber(Number(token.totalSupply))}
                <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                  {token.symbol}
                </span>
              </div>
              <div className="num text-[11px] uppercase tracking-wide text-muted-foreground">
                Total supply
              </div>
            </div>

            <a
              href={`https://etherscan.io/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="num mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {shortenAddress(token.address)}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Read directly from Ethereum mainnet contracts via viem, independent of
        the DeFiLlama API.
      </p>
    </motion.div>
  );
}
