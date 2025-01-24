import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

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
