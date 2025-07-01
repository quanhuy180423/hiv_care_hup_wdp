import type { ReactNode } from "react";
import { Assets } from "@/assets";
import { Link } from "react-router";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-600 to-green-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 via-transparent to-blue-500/30"></div>

      {/* Additional decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-300/10 to-green-300/20"></div>

      {/* Header với Logo */}
      <header className="relative z-10 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center md:justify-start">
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
              <img
                src={Assets.logoHIV}
                alt="HIV Care Hub Logo"
                className="w-12 h-12 rounded-full object-cover shadow-lg ring-2 ring-white"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent drop-shadow-lg">
                  HIV Care Hub
                </h1>
                <p className="text-sm text-white/90 drop-shadow-sm">
                  Chăm sóc sức khỏe toàn diện
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center py-2 min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-2xl">
          {/* Card Container */}
          <div className="opacity-100 bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8 shadow-blue-500/10">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-sm text-white/80 drop-shadow-sm">
              © 2025 HIV Care Hub. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/30 to-green-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-green-400/25 to-blue-500/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-green-300/20 rounded-full blur-2xl"></div>
    </div>
  );
}
