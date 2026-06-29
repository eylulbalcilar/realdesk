// Presentation-only helpers shared across UI components.
// Core data/logic lives in defillama.ts, risk-scores.ts and types.ts and is untouched.

export function formatCompactUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

// Compact number without a currency prefix (e.g. token supply)
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(2);
}

// 0x1234...abcd style address shortening
export function shortenAddress(address: string): string {
  if (address.length < 11) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Letter grade -> text color (used for accent numerals)
export function gradeTextClass(letter: string): string {
  switch (letter) {
    case 'A':
      return 'text-emerald-400';
    case 'B':
      return 'text-lime-400';
    case 'C':
      return 'text-amber-400';
    case 'D':
      return 'text-orange-400';
    case 'F':
      return 'text-red-400';
    default:
      return 'text-foreground';
  }
}

// Letter grade -> pill styling (background tint + border + text)
export function gradeBadgeClass(letter: string): string {
  switch (letter) {
    case 'A':
      return 'bg-emerald-500/12 text-emerald-400 border-emerald-500/30';
    case 'B':
      return 'bg-lime-500/12 text-lime-400 border-lime-500/30';
    case 'C':
      return 'bg-amber-500/12 text-amber-400 border-amber-500/30';
    case 'D':
      return 'bg-orange-500/12 text-orange-400 border-orange-500/30';
    case 'F':
      return 'bg-red-500/12 text-red-400 border-red-500/30';
    default:
      return 'bg-muted text-foreground border-border';
  }
}

// Score (0-5) -> bar gradient classes, greener as risk falls
export function scoreBarClass(score: number): string {
  if (score >= 4.5) return 'from-emerald-500 to-emerald-400';
  if (score >= 3.5) return 'from-lime-500 to-lime-400';
  if (score >= 2.5) return 'from-amber-500 to-amber-400';
  if (score >= 1.5) return 'from-orange-500 to-orange-400';
  return 'from-red-500 to-red-400';
}
