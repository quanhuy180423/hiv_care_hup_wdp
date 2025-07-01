import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRouteConfig } from "@/routes";

export function useDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const route = getRouteConfig(location.pathname);
    const title = route ? route.title : "HIV Care Hub";
    const appName = "HIV Care Hub";

    document.title = route ? `${title} - ${appName}` : appName;
  }, [location.pathname]);
}
