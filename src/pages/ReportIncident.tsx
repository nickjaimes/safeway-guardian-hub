import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ReportIncident = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report an incident.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const location = formData.get("location") as string;
      const datetime = formData.get("datetime") as string;
      const contact = formData.get("contact") as string;

      let imageUrl = null;
      let videoUrl = null;

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const isVideo = selectedFile.type.startsWith("video/");

        const { error: uploadError, data } = await supabase.storage
          .from("incident-media")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("incident-media")
          .getPublicUrl(fileName);

        if (isVideo) {
          videoUrl = publicUrl;
        } else {
          imageUrl = publicUrl;
        }
      }

      // Insert incident report
      const { error } = await supabase.from("incident_reports").insert({
        reported_by: user.id,
        title,
        description,
        location,
        contact_info: contact || null,
        image_url: imageUrl,
        video_url: videoUrl,
        created_at: datetime || new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Your incident report has been received and is pending verification.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report. Please try again.",
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Report an Incident</h1>
            <p className="text-muted-foreground">
              Help us respond quickly by providing accurate details about the incident.
            </p>
          </div>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                All fields marked with * are required. Your report will be reviewed by our team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Brief description of the incident"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Please provide as much detail as possible about what happened..."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, Street, Landmark"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="datetime">Date & Time *</Label>
                    <Input
                      id="datetime"
                      name="datetime"
                      type="datetime-local"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Photo/Video Evidence</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
                    <label htmlFor="photo" className="cursor-pointer block">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, MP4 up to 10MB
                      </p>
                    </label>
                    <Input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information (Optional)</Label>
                  <Input
                    id="contact"
                    name="contact"
                    type="tel"
                    placeholder="Your phone number for follow-up"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be kept confidential and used only for verification purposes.
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

export default ReportIncident;
