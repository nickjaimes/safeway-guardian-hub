import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Calendar } from "lucide-react";

interface IncidentCardProps {
  title: string;
  description: string;
  location: string;
  date: string;
  status: "urgent" | "pending" | "verified";
  imageUrl?: string;
}

export const IncidentCard = ({
  title,
  description,
  location,
  date,
  status,
  imageUrl,
}: IncidentCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-all">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight text-foreground">{title}</h3>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
