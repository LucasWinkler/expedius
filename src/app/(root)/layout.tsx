import { Nav } from "@/components/layout/Nav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
