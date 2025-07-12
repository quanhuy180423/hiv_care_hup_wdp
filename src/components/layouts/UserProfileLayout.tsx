import SidebarUser from "../sidebar/SidebarUserProfile";
import { SidebarProvider } from "../ui/sidebar";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

export function UserProfileLayout({ children }: UserProfileLayoutProps) {
  return (
    // <div>
    //   <Header />
    //   <main className="container mx-auto px-4 py-8">
    //     <SidebarUserProfile children={children} />
    //   </main>
    //   <Footer />
    // </div>
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarUser children={children} />
      </div>
    </SidebarProvider>
  );
}
