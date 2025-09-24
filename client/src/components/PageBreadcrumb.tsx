import { Home } from "lucide-react";
import { useLocation } from "wouter";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItemData[];
  className?: string;
}

export function PageBreadcrumb({ items, className = "mb-4" }: PageBreadcrumbProps) {
  const [, setLocation] = useLocation();

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={() => setLocation("/")}
            className="flex items-center cursor-pointer"
            data-testid="breadcrumb-home"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {items.map((item, index) => (
          <div key={index} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  onClick={() => setLocation(item.href!)}
                  className="cursor-pointer"
                  data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage data-testid="breadcrumb-current">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}