import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Auth state from useAuth hook
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Đăng xuất thành công");
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Đăng xuất thất bại");
      });
  };

  const handleProfile = () => {
    setIsUserMenuOpen(false);
    if (user?.role === "PATIENT") {
      navigate("/user/profile");
    } else if (user?.role === "DOCTOR") {
      navigate("/doctor/profile");
    } else if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (user?.role === "STAFF") {
      navigate("/staff/appointments");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  HIV Care Hub
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-8">
                <Link
                  to="/"
                  className={`font-medium transition-colors ${
                    isActive("/")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/services"
                  className={`font-medium transition-colors ${
                    isActive("/services")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  to="/about"
                  className={`font-medium transition-colors ${
                    isActive("/about")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Giới thiệu
                </Link>
                <Link
                  to="/contact"
                  className={`font-medium transition-colors ${
                    isActive("/contact")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Liên hệ
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/services/appointment/register"
                    className={`font-medium transition-colors ${
                      isActive("/services/appointment/register")
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }`}
                  >
                    Đặt lịch
                  </Link>
                )}
              </nav>
            </div>

            {/* Right Side - Search, Notifications, User Menu */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-transparent outline-none text-sm w-32 lg:w-48"
                />
              </div>

              {/* Notifications */}
              {isAuthenticated && (
                <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name || user?.email}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={handleProfile}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Hồ sơ</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/settings");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Cài đặt</span>
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Buttons */
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={handleRegister}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Đăng ký
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link
                  to="/"
                  className={`font-medium transition-colors ${
                    isActive("/")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/services"
                  className={`font-medium transition-colors ${
                    isActive("/services")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Dịch vụ
                </Link>
                <Link
                  to="/about"
                  className={`font-medium transition-colors ${
                    isActive("/about")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Giới thiệu
                </Link>
                <Link
                  to="/contact"
                  className={`font-medium transition-colors ${
                    isActive("/contact")
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  Liên hệ
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/services/appointment/register"
                    className={`font-medium transition-colors ${
                      isActive("/services/appointment/register")
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }`}
                  >
                    Đặt lịch
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
}
