import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SafeCheckin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState("");

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to check in as safe",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    setLocationError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const message = formData.get("message") as string;
    const contactInfo = formData.get("contact") as string;

    try {
      // Get current location
      const coords = await getCurrentLocation();

      const { error } = await supabase.from("safe_checkins").insert({
        user_id: user.id,
        name,
        location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        message: message || null,
        contact_info: contactInfo || null,
      });

      if (error) throw error;

      toast({
        title: "Check-in Successful",
        description: "Your safety status has been recorded. Stay safe!",
      });
      navigate("/");
    } catch (error: any) {
      if (error.code === "PERMISSION_DENIED" || error.message?.includes("Geolocation")) {
        setLocationError("Location access denied. Please enable location services to check in.");
      }
      toast({
        title: "Error",
        description: error.message || "Failed to submit check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Heart className="h-16 w-16 text-safe mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">I'm Safe Check-in</h1>
            <p className="text-muted-foreground">
              Let your loved ones know you're safe during an emergency
            </p>
          </div>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Safety Check-in</CardTitle>
              <CardDescription>
                Your location will be automatically detected and shared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Current Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="Describe your location (e.g., Home, Office, Evacuation Center)"
                      className="pl-9"
                      required
                    />
                  </div>
                  {locationError && (
                    <p className="text-sm text-destructive">{locationError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Add any additional information about your status..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number (Optional)</Label>
                  <Input
                    id="contact"
                    name="contact"
                    type="tel"
                    placeholder="Your phone number"
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm font-semibold">Privacy Notice:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your check-in will be visible to the public</li>
                    <li>• Your exact coordinates will be captured for emergency services</li>
                    <li>• Contact information is optional and kept private</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting || !user}
                  >
                    {isSubmitting ? "Checking in..." : "Check In as Safe"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>

                {!user && (
                  <p className="text-sm text-center text-muted-foreground">
                    Please <a href="/auth" className="text-accent underline">sign in</a> to check in as safe
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SafeCheckin;
