import Link from 'next/link';

export function Header() {
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
        </nav>
      </div>
    </header>
  );
}
