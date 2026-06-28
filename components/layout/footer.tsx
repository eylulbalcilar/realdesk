import Link from 'next/link';
import { Hexagon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/70">
      <div className="shell flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <Hexagon className="h-4 w-4 text-primary" strokeWidth={2.4} />
          </span>
          <p className="text-sm text-muted-foreground">
            Data from{' '}
            <a
              href="https://defillama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              DeFiLlama
            </a>
            . Not investment advice.
          </p>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link
            href="/methodology"
            className="transition-colors hover:text-foreground"
          >
            Methodology
          </Link>
          <a
            href="https://github.com/eylulbalcilar/realdesk"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
