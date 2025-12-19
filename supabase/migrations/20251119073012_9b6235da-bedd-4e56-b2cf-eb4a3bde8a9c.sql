-- Add analytics columns to plots table for tracking engagement
ALTER TABLE public.plots 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inquiries_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS saves_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS listing_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMP WITH TIME ZONE;

-- Create table for tracking plot views
CREATE TABLE IF NOT EXISTS public.plot_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  session_id TEXT
);

-- Create table for saved plots
CREATE TABLE IF NOT EXISTS public.saved_plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(plot_id, user_id)
);

-- Enable RLS
ALTER TABLE public.plot_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_plots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plot_views
CREATE POLICY "Anyone can create plot views"
  ON public.plot_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own plot views"
  ON public.plot_views FOR SELECT
  USING (viewer_id = auth.uid() OR viewer_id IS NULL);

-- RLS Policies for saved_plots
CREATE POLICY "Users can save plots"
  ON public.saved_plots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their saved plots"
  ON public.saved_plots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved plots"
  ON public.saved_plots FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update view counts
CREATE OR REPLACE FUNCTION update_plot_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.plots
  SET views_count = views_count + 1
  WHERE id = NEW.plot_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update view count
CREATE TRIGGER increment_plot_views
  AFTER INSERT ON public.plot_views
  FOR EACH ROW
  EXECUTE FUNCTION update_plot_view_count();

-- Function to update saves count
CREATE OR REPLACE FUNCTION update_plot_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.plots
    SET saves_count = saves_count + 1
    WHERE id = NEW.plot_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.plots
    SET saves_count = saves_count - 1
    WHERE id = OLD.plot_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update saves count
CREATE TRIGGER update_plot_saves_trigger
  AFTER INSERT OR DELETE ON public.saved_plots
  FOR EACH ROW
  EXECUTE FUNCTION update_plot_saves_count();