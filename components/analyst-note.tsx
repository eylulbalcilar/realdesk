'use client';

import { motion } from 'framer-motion';
import { PenLine, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalystNote as AnalystNoteType } from '@/lib/types';

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function AnalystNote({ note }: { note: AnalystNoteType }) {
  const hasBull = (note.bullishPoints?.length ?? 0) > 0;
  const hasBear = (note.bearishPoints?.length ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.04] p-5"
    >
      {/* Left accent bar gives the card a written, human-note feel */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-primary shadow-[0_0_12px_var(--primary)]"
      />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 pl-2">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/25">
            <PenLine className="h-3.5 w-3.5" />
          </span>
          <h3 className="font-display text-sm font-semibold tracking-tight">
            Analyst Note
          </h3>
        </div>
        <span className="num text-xs text-muted-foreground">
          Updated {formatDate(note.lastUpdated)}
        </span>
      </div>

      <p className="pl-2 text-sm leading-relaxed text-foreground/90">
        {note.summary}
      </p>

      {(hasBull || hasBear) && (
        <div className="mt-4 grid gap-4 pl-2 sm:grid-cols-2">
          {hasBull && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                Bullish
              </div>
              <ul className="space-y-1.5">
                {note.bullishPoints!.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-snug text-muted-foreground"
                  >
                    <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasBear && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-400">
                <TrendingDown className="h-3.5 w-3.5" />
                Bearish
              </div>
              <ul className="space-y-1.5">
                {note.bearishPoints!.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-snug text-muted-foreground"
                  >
                    <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
