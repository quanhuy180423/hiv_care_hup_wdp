import Footer from "../Footer";
import Header from "../Header";
import SidebarUserProfile from "../sidebar/SidebarUserProfile";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

export function UserProfileLayout({ children }: UserProfileLayoutProps) {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SidebarUserProfile children={children} />
      </main>
      <Footer />
    </div>
  );
}
