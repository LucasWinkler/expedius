import { Nav, Footer } from "@/components/layout";
import { LocationProvider } from "@/contexts";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LocationProvider>
        <Nav />
        <main className="flex-grow">{children}</main>
        <Footer />
      </LocationProvider>
    </>
  );
};

export default AppLayout;
