// import { useNavigate } from "react-router-dom";
import Banner from "@/components/Banner";
import { ServicesPage } from "../services/ServicesPage";
import { AboutPage } from "../abouts/AboutPage";

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
