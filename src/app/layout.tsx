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
    "Find and save your favourite places near you or anywhere in the world with PoiToGo. Create custom lists and share your public profile with others.",
  openGraph: {
    type: "website",
    url: "https://poitogo.vercel.app/",
    title: "PoiToGo",
    description:
      "Find and save your favourite places near you or anywhere in the world with PoiToGo. Create custom lists and share your public profile with others.",
    siteName: "PoiToGo",
    images: [
      {
        url: "https://poitogo.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "Homepage screenshot showing a hero section with a search bar and suggested search terms.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    creator: "@LucasJWinkler",
  },
};

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
