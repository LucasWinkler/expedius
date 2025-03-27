import { Nav, Footer } from "@/components/layout";
import { LocationProvider } from "@/contexts";
import SearchUnavailableDialog from "@/components/common/SearchUnavailableDialog";
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LocationProvider>
        <Nav />
        <main className="flex-grow">{children}</main>
        <Footer />
        <SearchUnavailableDialog />
      </LocationProvider>
    </>
  );
};

export default AppLayout;
