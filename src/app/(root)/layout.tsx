import { Nav, Footer } from "@/components/layout";
import { LocationProvider } from "@/contexts";
import QuotaWarningDialog from "@/components/common/QuotaWarningDialog";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LocationProvider>
        <Nav />
        <main className="flex-grow">{children}</main>
        <Footer />
        <QuotaWarningDialog />
      </LocationProvider>
    </>
  );
};

export default AppLayout;
