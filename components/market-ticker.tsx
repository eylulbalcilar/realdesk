'use client';

import { Protocol } from '@/lib/types';
import { formatCompactUsd } from '@/lib/ui';

// Continuous Bloomberg-style ticker strip. The protocol list is rendered twice
// so the CSS marquee can loop seamlessly without a visible seam.
export function MarketTicker({ protocols }: { protocols: Protocol[] }) {
  if (protocols.length === 0) return null;

  const items = [...protocols, ...protocols];

  return (
    <div className="marquee-mask relative overflow-hidden border-y border-border/70 bg-card/40">
      <div className="flex w-max animate-marquee">
        {items.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="flex items-center gap-3 whitespace-nowrap border-r border-border/50 px-6 py-2.5"
          >
            <span className="num text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {p.name}
            </span>
            <span className="num text-sm font-semibold text-pos">
              {p.apy.toFixed(2)}%
            </span>
            <span className="num text-xs text-muted-foreground">
              {formatCompactUsd(p.tvl)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
