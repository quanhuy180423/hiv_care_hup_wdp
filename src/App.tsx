import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { allRoutes, notFoundRoute } from "@/routes";
import { RouteGuard } from "@/components/RouteGuard";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function App() {
  // Update document title based on current route
  useDocumentTitle();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          {allRoutes.map((route) => {
            const Component = route.component;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RouteGuard
                    isProtected={route.protected}
                    allowedRoles={route.allowedRoles}
                  >
                    <LayoutWrapper layout={route.layout}>
                      <Toaster />
                      <Component />
                    </LayoutWrapper>
                  </RouteGuard>
                }
              />
            );
          })}
          <Route
            path={notFoundRoute.path}
            element={
              <LayoutWrapper layout="PATIENT">
                <notFoundRoute.component />
              </LayoutWrapper>
            }
          />
        </Routes>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold text-red-600">Đã xảy ra lỗi</h1>
        <p className="text-gray-600">{error.message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Tải lại trang
        </button>
      </div>
    </div>
  );
}

export default App;
