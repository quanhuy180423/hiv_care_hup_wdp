import { Assets } from "@/assets";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { path: "/", label: "Trang chủ" },
    { path: "/login", label: "Đăng nhập" },
    { path: "/users", label: "Người dùng" },
    { path: "/counter", label: "Counter" },
  ];

  const techStack = [
    "Vite",
    "React",
    "TypeScript",
    "Zustand",
    "React Query",
    "Shadcn UI",
    "Tailwind CSS",
    "React Router",
  ];

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo và Thông tin */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={Assets.logoHIV}
                alt="HIV Care Hub Logo"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold text-primary">HIV Care Hub</h3>
                <p className="text-sm text-muted-foreground">
                  Modern React App
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Ứng dụng web hiện đại được xây dựng với các công nghệ tiên tiến
              nhất để mang lại trải nghiệm tốt nhất cho người dùng.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liên kết nhanh</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto p-2 text-sm"
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Công nghệ sử dụng</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@hivcarehub.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-200" />

        {/* Bottom Footer */}
        <div className="flex items-center justify-center">
            <span>© 2025 HIV Care Hub.</span>
        </div>
      </div>
    </footer>
  );
}
