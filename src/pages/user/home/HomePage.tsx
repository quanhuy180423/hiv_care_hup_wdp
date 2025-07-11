// import { useNavigate } from "react-router-dom";
import Banner from "@/components/Banner";
import { AboutPage } from "../abouts/AboutPage";
import ServicesPage from "../services/ServicesPage";

export function HomePage() {
  return (
    <div className="space-y-6">
      {/* Banner Section */}
      <div className="h-screen">
        <Banner />
      </div>

      {/* Main Services Section */}
      <div className="container mx-auto px-4 ">
        <ServicesPage />
        <AboutPage />
      </div>
    </div>
  );
}
