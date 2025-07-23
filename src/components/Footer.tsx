import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-400">HIV Care Hub</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Cung cấp dịch vụ y tế tốt nhất với cơ sở vật chất hiện đại và đội ngũ bác sĩ chuyên môn cao.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>+84 28 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>info@hivcarehub.vn</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Liên Kết Nhanh</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a 
                    href="/" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/");
                    }}
                  >
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a 
                    href="/services" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/services");
                    }}
                  >
                    Dịch vụ
                  </a>
                </li>
                <li>
                  <a 
                    href="/about" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/about");
                    }}
                  >
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/contact");
                    }}
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Dịch Vụ</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a 
                    href="/services" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/services");
                    }}
                  >
                    Cấp cứu
                  </a>
                </li>
                <li>
                  <a 
                    href="/services" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/services");
                    }}
                  >
                    Xét nghiệm
                  </a>
                </li>
                <li>
                  <a 
                    href="/services/appointment/register" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/services/appointment/register");
                    }}
                  >
                    Đặt lịch
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    className="hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/contact");
                    }}
                  >
                    Tư vấn
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Theo Dõi Chúng Tôi</h4>
              <p className="text-gray-300 mb-4">
                Cập nhật thông tin mới nhất về dịch vụ và sức khỏe
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2024 HIV Care Hub. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
