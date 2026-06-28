'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Protocols' },
  { href: '/methodology', label: 'Methodology' },
];

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' || pathname.startsWith('/protocol') : pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="shell flex h-20 items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
            Realdesk
          </span>
          <span className="num mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            RWA Terminal
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-4 py-2.5 text-base font-medium transition-colors ${
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                )}
              </Link>
            );
          })}

          {/* Live data badge */}
          <span className="ml-1 hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="live-ring absolute inset-0 rounded-full bg-emerald-400" />
              <span className="live-dot relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="num text-xs font-medium tracking-wide text-emerald-400">
              LIVE
            </span>
            <span className="text-xs text-muted-foreground">DeFiLlama</span>
          </span>

          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="ml-1 grid h-11 w-11 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block" />
            <Moon className="h-5 w-5 block dark:hidden" />
          </button>
        </nav>
      </div>
    </header>
  );
}
