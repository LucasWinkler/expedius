import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/providers";
import { createMetadata } from "@/lib/metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = createMetadata({});

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-background font-sans antialiased`}>
        <Providers>{children}</Providers>
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
