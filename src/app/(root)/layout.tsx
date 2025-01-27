"use client";

import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { LocationProvider } from "@/contexts/LocationContext";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LocationProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
    </LocationProvider>
  );
};

export default AppLayout;
