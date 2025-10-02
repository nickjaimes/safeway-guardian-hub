import { Link, useLocation } from "react-router-dom";
import { AlertCircle, Users, PlusCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "News Feed", icon: AlertCircle },
    { path: "/missing", label: "Missing Persons", icon: Users },
    { path: "/report", label: "Report Incident", icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-hero shadow-elevated">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <Shield className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">SAFEWAY GUARDIAN</span>
              <span className="text-xs opacity-90">Crisis Response Platform</span>
            </div>
          </Link>

          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
