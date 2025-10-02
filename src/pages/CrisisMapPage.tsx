import { Navigation } from "@/components/Navigation";
import { CrisisMap } from "@/components/CrisisMap";

const CrisisMapPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Crisis Map</h1>
          <p className="text-muted-foreground">
            Real-time visualization of incidents, missing persons, and safe check-ins
          </p>
        </div>

        <CrisisMap />
      </main>
    </div>
  );
};

export default CrisisMapPage;
