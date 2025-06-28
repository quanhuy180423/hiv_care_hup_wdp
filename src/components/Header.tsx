import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, LogIn } from "lucide-react";
import { Assets } from "@/assets";
import { useState } from "react";
import { navigationRoutes } from "@/routes";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Auth state from useAuth hook
  const { isAuthenticated, user } = useAuth();

  // Filter navigation items based on user role
  const navItems = navigationRoutes
    .filter((route) => {
      // If route has allowedRoles, check if user's role is included
      if (route.allowedRoles && user) {
        return route.allowedRoles.includes(user.role);
      }
      // If no allowedRoles specified, show to everyone
      if (!route.allowedRoles) {
        return true;
      }
      // If user is not authenticated, only show public routes
      return !route.protected;
    })
    .map((route) => ({
      path: route.path,
      label: route.title,
      icon: route.icon!,
    }));

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    authService.clearAuth();
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/user/profile"); // Navigate to correct profile path
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo và Title */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <img
                src={Assets.logoHIV}
                alt="HIV Care Hub Logo"
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">HIV Care Hub</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                );
              })}

              {/* User Menu or Login Button */}
              {isAuthenticated && user ? (
                <div className="relative ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </Button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      {/* Overlay để đóng menu khi click bên ngoài */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md border shadow-lg z-20">
                        <div className="py-1">
                          <div className="px-3 py-2 text-sm text-muted-foreground border-b ursor-pointer">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs">{user.email}</p>
                            <p className="text-xs capitalize">{user.role}</p>
                          </div>
                          <Button
                            onClick={handleProfile}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                          >
                            <Settings className="h-4 w-4" />
                            Hồ sơ cá nhân
                          </Button>
                          <Button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-red-600"
                          >
                            <LogOut className="h-4 w-4" />
                            Đăng xuất
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 ml-2"
                  onClick={() => handleNavigation("/login")}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline">Đăng nhập</span>
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="justify-start gap-3"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}

                {/* Mobile User Menu */}
                {isAuthenticated && user ? (
                  <div className="border-t pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/user/profile");
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      Hồ sơ cá nhân
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 w-full text-red-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <div className="border-t pt-2 mt-2">
                    <Button
                      variant="default"
                      className="justify-start gap-3 w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/login");
                      }}
                    >
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sub Header với thông tin công nghệ */}
    </>
  );
}
