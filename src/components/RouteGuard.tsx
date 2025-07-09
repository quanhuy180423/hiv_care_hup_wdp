import { Navigate, useLocation } from "react-router-dom";
import { ROUTES, getDefaultRouteForRole } from "@/routes";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/store/authStore";

interface RouteGuardProps {
  children: React.ReactNode;
  isProtected?: boolean;
  allowedRoles?: UserRole[];
}

export function RouteGuard({
  children,
  isProtected = false,
  allowedRoles = ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
}: RouteGuardProps) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">
            Đang kiểm tra phiên đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated for protected routes
  if (isProtected && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  //if user is authenticated but not user try to access login page
  if (
    isAuthenticated &&
    user &&
    (location.pathname === ROUTES.LOGIN ||
      location.pathname === ROUTES.REGISTER)
  ) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Check if user has required role
  if (
    isAuthenticated &&
    user &&
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    // Redirect to appropriate default route for user's role
    const redirectPath = getDefaultRouteForRole(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
