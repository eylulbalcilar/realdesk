import type { Metadata } from "next";
import { Chakra_Petch, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';

// Display + body share Chakra Petch (squared, technical terminal voice).
const chakraPetch = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Numbers use Space Mono for a retro-terminal monospace feel.
const spaceMono = Space_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Realdesk",
  description: "Compare RWA protocols by yield and risk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${chakraPetch.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Fixed ambient backdrop: grid texture + violet glow behind all content */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10"
          >
            <div className="absolute inset-0 ambient" />
            <div className="absolute inset-0 grid-bg grid-fade opacity-60" />
          </div>

          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
