import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { allRoutes, notFoundRoute } from "@/routes";
// import { RouteGuard } from "@/components/RouteGuard";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Toaster } from "react-hot-toast";

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
      <Routes>
        {allRoutes.map((route) => {
          const Component = route.component;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                // <RouteGuard
                //   isProtected={route.protected}
                //   allowedRoles={route.allowedRoles}
                // >
                <LayoutWrapper layout={route.layout}>
                  <Toaster />
                  <Component />
                </LayoutWrapper>
                // </RouteGuard>
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
    </QueryClientProvider>
  );
}

export default App;
