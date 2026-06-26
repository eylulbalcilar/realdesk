'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Realdesk
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Protocols
          </Link>
          <Link
            href="/methodology"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Methodology
          </Link>
          <button
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 hidden dark:block" />
            <Moon className="h-4 w-4 block dark:hidden" />
          </button>
        </nav>
      </div>
    </header>
  );
}
