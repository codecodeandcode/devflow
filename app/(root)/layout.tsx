import NavBar from "@/components/navigation/navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <NavBar></NavBar>
      {children}
    </main>
  );
}
