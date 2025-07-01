import type { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* User Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
