import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MissingPersons = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Report Submitted",
        description: "The missing person report has been submitted. We will do everything we can to help reunite your loved one.",
      });
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Report a Missing Person</h1>
            <p className="text-muted-foreground">
              Every detail helps. Please provide as much information as possible.
            </p>
          </div>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Missing Person Information</CardTitle>
              <CardDescription>
                All fields marked with * are required. Photos are automatically blurred for privacy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="First and last name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age"
                      min="0"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Physical Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Height, build, hair color, clothing, distinguishing features..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lastSeen">Last Seen Location *</Label>
                    <Input
                      id="lastSeen"
                      placeholder="Specific place or landmark"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="datetime">Date & Time Last Seen *</Label>
                    <Input
                      id="datetime"
                      type="datetime-local"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="circumstances">Circumstances</Label>
                  <Textarea
                    id="circumstances"
                    placeholder="What were they doing? Where were they going? Any other relevant details..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Recent Photo *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                    <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Upload a clear, recent photo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG or JPG up to 5MB (will be automatically blurred)
                    </p>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Your Contact Information *</Label>
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="Your phone number"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    For updates and to verify sightings. Will be kept confidential.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Your Relationship to Missing Person *</Label>
                  <Input
                    id="relationship"
                    placeholder="e.g., Parent, Spouse, Sibling, Friend"
                    required
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy & Safety:</strong> All photos will be automatically blurred to protect the missing person's privacy. 
                    Clear photos will only be shared with verified authorities and volunteers.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MissingPersons;
