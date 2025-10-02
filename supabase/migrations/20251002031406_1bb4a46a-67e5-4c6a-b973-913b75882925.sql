-- Create enum for report status
CREATE TYPE report_status AS ENUM ('urgent', 'pending', 'verified', 'found');

-- Create enum for incident category
CREATE TYPE incident_category AS ENUM ('earthquake', 'flood', 'fire', 'typhoon', 'other');

-- Incident Reports Table
CREATE TABLE public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status report_status DEFAULT 'pending',
  category incident_category DEFAULT 'other',
  contact_info TEXT,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Missing Persons Table
CREATE TABLE public.missing_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  description TEXT,
  last_seen_location TEXT NOT NULL,
  last_seen_datetime TIMESTAMPTZ NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status report_status DEFAULT 'urgent',
  circumstances TEXT,
  contact_info TEXT NOT NULL,
  relationship TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Sightings Table (for missing persons)
CREATE TABLE public.sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  missing_person_id UUID REFERENCES public.missing_persons(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  sighting_datetime TIMESTAMPTZ NOT NULL,
  description TEXT,
  contact_info TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Safe Check-ins Table
CREATE TABLE public.safe_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  message TEXT,
  contact_info TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missing_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_checkins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Incident Reports (Public Read, Authenticated Write)
CREATE POLICY "Anyone can view incident reports"
  ON public.incident_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create incident reports"
  ON public.incident_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own incident reports"
  ON public.incident_reports FOR UPDATE
  TO authenticated
  USING (reported_by = auth.uid());

-- RLS Policies for Missing Persons (Public Read, Authenticated Write)
CREATE POLICY "Anyone can view missing persons"
  ON public.missing_persons FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create missing person reports"
  ON public.missing_persons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own missing person reports"
  ON public.missing_persons FOR UPDATE
  TO authenticated
  USING (reported_by = auth.uid());

-- RLS Policies for Sightings (Public Read, Authenticated Write)
CREATE POLICY "Anyone can view sightings"
  ON public.sightings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create sightings"
  ON public.sightings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for Safe Check-ins (Public Read, Owner Write)
CREATE POLICY "Anyone can view safe check-ins"
  ON public.safe_checkins FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create safe check-ins"
  ON public.safe_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own safe check-ins"
  ON public.safe_checkins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_incident_reports_status ON public.incident_reports(status);
CREATE INDEX idx_incident_reports_created ON public.incident_reports(created_at DESC);
CREATE INDEX idx_incident_reports_location ON public.incident_reports(latitude, longitude);

CREATE INDEX idx_missing_persons_status ON public.missing_persons(status);
CREATE INDEX idx_missing_persons_created ON public.missing_persons(created_at DESC);
CREATE INDEX idx_missing_persons_location ON public.missing_persons(latitude, longitude);

CREATE INDEX idx_sightings_missing_person ON public.sightings(missing_person_id);
CREATE INDEX idx_sightings_created ON public.sightings(created_at DESC);

CREATE INDEX idx_safe_checkins_user ON public.safe_checkins(user_id);
CREATE INDEX idx_safe_checkins_created ON public.safe_checkins(created_at DESC);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_incident_reports_updated_at
  BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missing_persons_updated_at
  BEFORE UPDATE ON public.missing_persons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for incident photos/videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('incident-media', 'incident-media', true);

-- Storage policies for incident media
CREATE POLICY "Anyone can view incident media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'incident-media');

CREATE POLICY "Authenticated users can upload incident media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'incident-media');

-- Storage bucket for missing person photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('missing-persons-photos', 'missing-persons-photos', true);

-- Storage policies for missing person photos
CREATE POLICY "Anyone can view missing person photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'missing-persons-photos');

CREATE POLICY "Authenticated users can upload missing person photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'missing-persons-photos');