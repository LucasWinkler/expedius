"use client";

import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { LocationProvider } from "@/context/LocationContext";
import { ListsProvider } from "@/contexts/ListsContext";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LocationProvider>
      <ListsProvider>
        <Nav />
        <main>{children}</main>
        <Footer />
      </ListsProvider>
    </LocationProvider>
  );
};

export default AppLayout;
