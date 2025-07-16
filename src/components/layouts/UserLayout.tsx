import type { ReactNode } from "react";
import Footer from "../Footer";
import { ChevronDown, Facebook, Instagram, Twitter } from "lucide-react";
import Header from "../Header";

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* User Header */}
     <Header />

      {/* Main Content */}
      <main>{children}</main>

       {/* Footer */}
      <Footer />  
    </div>
  );
}
