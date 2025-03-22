import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { createMetadata } from "@/lib/metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = createMetadata({});

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-background font-sans antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster
          position="bottom-right"
          expand={true}
          richColors={true}
          closeButton={true}
          duration={3000}
        />
      </body>
    </html>
  );
};

export default RootLayout;
