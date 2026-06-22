import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Data from{' '}
          <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">DeFiLlama</a>
          . Not investment advice.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
          <a href="https://github.com/eylulbalcilar/realdesk" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
