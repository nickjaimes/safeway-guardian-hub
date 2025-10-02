import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "./StatusBadge";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card } from "./ui/card";

// Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icons for different marker types
const incidentIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const missingPersonIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const safeCheckinIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface IncidentReport {
  id: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  status: "urgent" | "pending" | "verified" | "found";
  created_at: string;
}

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  last_seen_location: string;
  latitude: number;
  longitude: number;
  status: "urgent" | "pending" | "verified" | "found";
  created_at: string;
}

interface SafeCheckin {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export const CrisisMap = () => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);
  const [safeCheckins, setSafeCheckins] = useState<SafeCheckin[]>([]);
  const defaultCenter: [number, number] = [14.5995, 120.9842]; // Manila

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const incidentsChannel = supabase
      .channel("incidents-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "incident_reports" }, () => {
        fetchData();
      })
      .subscribe();

    const missingChannel = supabase
      .channel("missing-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "missing_persons" }, () => {
        fetchData();
      })
      .subscribe();

    const safeChannel = supabase
      .channel("safe-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "safe_checkins" }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(incidentsChannel);
      supabase.removeChannel(missingChannel);
      supabase.removeChannel(safeChannel);
    };
  }, []);

  const fetchData = async () => {
    const { data: incidentsData } = await supabase
      .from("incident_reports")
      .select("*")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false });

    if (incidentsData) setIncidents(incidentsData as IncidentReport[]);

    const { data: missingData } = await supabase
      .from("missing_persons")
      .select("*")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false});

    if (missingData) setMissingPersons(missingData as MissingPerson[]);

    const { data: safeData } = await supabase
      .from("safe_checkins")
      .select("*")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (safeData) setSafeCheckins(safeData as SafeCheckin[]);
  };

  return (
    <Card className="overflow-hidden shadow-elevated">
      <div className="h-[600px] w-full">
        <MapContainer
          {...{ center: defaultCenter, zoom: 12 } as any}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            {...{ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Incident markers */}
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              {...{ position: [incident.latitude, incident.longitude], icon: incidentIcon } as any}
            >
              <Popup>
                <div className="space-y-2">
                  <h3 className="font-bold">{incident.title}</h3>
                  <p className="text-sm">{incident.location}</p>
                  <StatusBadge status={incident.status as any} />
                  <p className="text-xs text-muted-foreground">
                    {new Date(incident.created_at).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Missing person markers */}
          {missingPersons.map((person) => (
            <Marker
              key={person.id}
              {...{ position: [person.latitude, person.longitude], icon: missingPersonIcon } as any}
            >
              <Popup>
                <div className="space-y-2">
                  <h3 className="font-bold">{person.name}</h3>
                  <p className="text-sm">Age: {person.age}</p>
                  <p className="text-sm">{person.last_seen_location}</p>
                  <StatusBadge status={person.status as any} />
                  <p className="text-xs text-muted-foreground">
                    {new Date(person.created_at).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Safe check-in markers */}
          {safeCheckins.map((checkin) => (
            <Marker
              key={checkin.id}
              {...{ position: [checkin.latitude, checkin.longitude], icon: safeCheckinIcon } as any}
            >
              <Popup>
                <div className="space-y-2">
                  <h3 className="font-bold">{checkin.name}</h3>
                  <p className="text-sm">{checkin.location}</p>
                  <p className="text-xs text-safe font-semibold">✓ Safe</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(checkin.created_at).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-4 bg-muted/50 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-urgent rounded-full"></div>
          <span>Incidents</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-pending rounded-full"></div>
          <span>Missing Persons</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-safe rounded-full"></div>
          <span>Safe Check-ins</span>
        </div>
      </div>
    </Card>
  );
};
