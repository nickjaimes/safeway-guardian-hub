import { Navigation } from "@/components/Navigation";
import { IncidentCard } from "@/components/IncidentCard";
import { MissingPersonCard } from "@/components/MissingPersonCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [missingPersons, setMissingPersons] = useState<any[]>([]);

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

    return () => {
      supabase.removeChannel(incidentsChannel);
      supabase.removeChannel(missingChannel);
    };
  }, []);

  const fetchData = async () => {
    const { data: incidentsData } = await supabase
      .from("incident_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (incidentsData) {
      setIncidents(
        incidentsData.map((incident) => ({
          id: incident.id,
          title: incident.title,
          description: incident.description,
          location: incident.location,
          date: new Date(incident.created_at).toLocaleString(),
          status: incident.status,
          imageUrl: incident.image_url,
        }))
      );
    }

    const { data: missingData } = await supabase
      .from("missing_persons")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (missingData) {
      setMissingPersons(
        missingData.map((person) => ({
          id: person.id,
          name: person.name,
          age: person.age,
          lastSeen: person.last_seen_location,
          location: person.last_seen_location,
          date: new Date(person.last_seen_datetime).toLocaleString(),
          status: person.status,
          description: person.description,
          imageUrl: person.image_url,
        }))
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Crisis Response & Community Safety
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Stay informed, report incidents, and help reunite families during emergencies.
            Together, we build a safer community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/report">
              <Button size="lg" variant="secondary" className="gap-2">
                <AlertCircle className="h-5 w-5" />
                Report an Incident
              </Button>
            </Link>
            <Link to="/missing">
              <Button size="lg" variant="outline" className="gap-2 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20">
                <Users className="h-5 w-5" />
                Report Missing Person
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="incidents" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="incidents" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Incident Reports
            </TabsTrigger>
            <TabsTrigger value="missing" className="gap-2">
              <Users className="h-4 w-4" />
              Missing Persons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} {...incident} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="missing" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {missingPersons.map((person) => (
                <MissingPersonCard key={person.id} {...person} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
