import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({
  children,
  navVariant = "solid",
}: {
  children: ReactNode;
  navVariant?: "solid" | "transparent";
}) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar variant={navVariant} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
