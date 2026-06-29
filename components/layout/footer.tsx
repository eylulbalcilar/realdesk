export function Footer() {
  return (
    <footer className="mt-12 border-t border-border/70">
      <div className="shell flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
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
        <a
          href="https://github.com/eylulbalcilar/realdesk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
