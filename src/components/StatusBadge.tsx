import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

type Status = "urgent" | "pending" | "verified" | "found";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  urgent: {
    label: "Urgent",
    icon: AlertCircle,
    className: "bg-urgent text-urgent-foreground",
  },
  pending: {
    label: "Pending Verification",
    icon: Clock,
    className: "bg-pending text-pending-foreground",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle,
    className: "bg-accent text-accent-foreground",
  },
  found: {
    label: "Found",
    icon: CheckCircle,
    className: "bg-safe text-safe-foreground",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};
