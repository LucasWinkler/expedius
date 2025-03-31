import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { createMetadata } from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HybridTooltipProvider } from "@/components/ui/hybrid-tooltip";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata = createMetadata({
  canonicalUrlRelative: "/",
});

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-background font-inter antialiased`}
      >
        <QueryProvider>
          <HybridTooltipProvider delayDuration={300}>
            {children}
            <Toaster
              position="bottom-right"
              expand={true}
              richColors={true}
              closeButton={true}
              duration={3000}
            />
          </HybridTooltipProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
