import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const navigate = useNavigate();
  return (
    <nav
      className={cn("flex items-center gap-2 text-base", className)}
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <React.Fragment key={item.label + idx}>
          {item.href && !item.active ? (
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "text-gray-500 hover:text-primary focus:outline-none px-1 py-0 rounded transition-colors duration-150 flex items-center gap-1 cursor-pointer",
                idx === 0 && "pl-0"
              )}
              onClick={() => navigate(item.href!)}
              tabIndex={0}
              aria-label={item.label}
            >
              {idx === 0 ? <Home className="w-4 h-4 mr-1 -ml-1" /> : null}
              <span className="truncate max-w-[120px] md:max-w-[200px]">
                {item.label}
              </span>
            </Button>
          ) : (
            <span
              className={cn(
                item.active ? "font-semibold text-primary" : "text-gray-500",
                "truncate max-w-[120px] md:max-w-[200px]"
              )}
              aria-current={item.active ? "page" : undefined}
            >
              {idx === 0 ? (
                <Home className="w-4 h-4 mr-1 -ml-1 inline" />
              ) : null}
              {item.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <span className="text-gray-300 mx-1 select-none">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
