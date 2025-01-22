import Nav from "@/components/layout/nav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
