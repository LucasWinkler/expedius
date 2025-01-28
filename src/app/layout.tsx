import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s - PoiToGo",
    default: "PoiToGo",
  },
  description:
    "PoiToGo is your travel guide. Find, organize, and share your favourite places from around the world.",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
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
