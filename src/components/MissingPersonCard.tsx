import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Calendar, User } from "lucide-react";

interface MissingPersonCardProps {
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  date: string;
  status: "urgent" | "pending" | "found";
  description?: string;
  imageUrl?: string;
}

export const MissingPersonCard = ({
  name,
  age,
  lastSeen,
  location,
  date,
  status,
  description,
  imageUrl,
}: MissingPersonCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-elevated transition-all">
      {imageUrl ? (
        <div className="aspect-square w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover blur-sm hover:blur-none transition-all"
          />
        </div>
      ) : (
        <div className="aspect-square w-full flex items-center justify-center bg-muted">
          <User className="h-24 w-24 text-muted-foreground/30" />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">Age: {age}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>Last seen: {lastSeen}</span>
          </div>
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
