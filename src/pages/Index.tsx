import { Navigation } from "@/components/Navigation";
import { IncidentCard } from "@/components/IncidentCard";
import { MissingPersonCard } from "@/components/MissingPersonCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Mock data - will be replaced with real data from backend
  const incidents = [
    {
      id: 1,
      title: "Earthquake Alert - Metro Manila",
      description: "Magnitude 6.5 earthquake reported. Multiple buildings damaged in the central business district. Emergency services are responding.",
      location: "Makati City, Metro Manila",
      date: "2025-10-02 14:30",
      status: "urgent" as const,
    },
    {
      id: 2,
      title: "Flooding in Northern Districts",
      description: "Heavy rainfall has caused severe flooding. Several roads are impassable. Evacuation centers are now open.",
      location: "Quezon City, Metro Manila",
      date: "2025-10-02 12:15",
      status: "verified" as const,
    },
    {
      id: 3,
      title: "Power Outage - Residential Area",
      description: "Widespread power outage affecting approximately 5,000 households. Utility crews are working to restore service.",
      location: "Pasig City, Metro Manila",
      date: "2025-10-02 10:45",
      status: "pending" as const,
    },
  ];

  const missingPersons = [
    {
      id: 1,
      name: "Maria Santos",
      age: 28,
      lastSeen: "SM Mall of Asia",
      location: "Pasay City",
      date: "2025-10-01 18:00",
      status: "urgent" as const,
      description: "Wearing blue dress, approximately 5'4\" tall",
    },
    {
      id: 2,
      name: "Juan Dela Cruz",
      age: 45,
      lastSeen: "Quezon Avenue",
      location: "Quezon City",
      date: "2025-10-01 09:30",
      status: "pending" as const,
      description: "Last seen wearing white shirt and jeans",
    },
  ];

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
