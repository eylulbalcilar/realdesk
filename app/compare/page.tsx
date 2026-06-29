import { Suspense } from 'react';
import { fetchProtocols } from '@/lib/defillama';
import { CompareView } from '@/components/compare-view';

// Static with hourly ISR. The protocol set is baked in at build time, and the
// selection is read client-side from the URL so the page never re-fetches the
// large DeFiLlama payload per request while staying shareable.
export const revalidate = 3600;

export const metadata = {
  title: 'Compare RWA Protocols',
  description: 'Compare RWA protocols side by side by yield, TVL, and risk.',
};

export default async function ComparePage() {
  const protocols = await fetchProtocols();

  return (
    <main className="shell pt-8 pb-10">
      <div className="mb-8 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Side-by-side analysis
        </span>
        <h1 className="font-display mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-gradient">Compare</span> Protocols
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Pick 2 to 4 protocols to compare yield, TVL, and the full risk
          breakdown side by side. The selection lives in the URL, so any
          comparison can be shared with a link.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Loading comparison...</div>
        }
      >
        <CompareView protocols={protocols} />
      </Suspense>
    </main>
  );
}
