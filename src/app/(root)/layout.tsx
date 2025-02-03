import { Nav, Footer } from "@/components/layout";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default AppLayout;
