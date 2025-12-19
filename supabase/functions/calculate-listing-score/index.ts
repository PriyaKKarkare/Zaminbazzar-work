import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plotId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Fetch plot data
    const { data: plot, error } = await supabaseClient
      .from('plots')
      .select('*')
      .eq('id', plotId)
      .single();

    if (error || !plot) {
      throw new Error('Plot not found');
    }

    // Calculate listing score (0-100)
    let score = 0;
    const suggestions: string[] = [];

    // Title & Description (20 points)
    if (plot.title && plot.title.length >= 20) {
      score += 10;
    } else {
      suggestions.push('Add a detailed title (minimum 20 characters)');
    }
    
    if (plot.description && plot.description.length >= 100) {
      score += 10;
    } else {
      suggestions.push('Add a comprehensive description (minimum 100 characters)');
    }

    // Images (20 points)
    const imageCount = plot.images ? plot.images.length : 0;
    if (imageCount >= 5) {
      score += 20;
    } else if (imageCount >= 3) {
      score += 15;
    } else if (imageCount >= 1) {
      score += 10;
    } else {
      suggestions.push('Add at least 5 high-quality images');
    }

    // Location Details (15 points)
    if (plot.state && plot.city && plot.locality) {
      score += 15;
    } else {
      suggestions.push('Complete all location details (state, city, locality)');
    }

    // Plot Specifications (15 points)
    if (plot.plot_length && plot.plot_width && plot.plot_facing && plot.plot_shape) {
      score += 15;
    } else {
      suggestions.push('Add complete plot specifications (dimensions, facing, shape)');
    }

    // Legal Documentation (15 points)
    const docs = [plot.doc_7_12, plot.doc_title_deed, plot.doc_tax_receipt].filter(Boolean);
    if (docs.length >= 3) {
      score += 15;
    } else {
      suggestions.push('Upload all legal documents (7/12, title deed, tax receipt)');
    }

    // Amenities (10 points)
    if (plot.has_electricity && plot.has_water_supply) {
      score += 10;
    } else {
      suggestions.push('Specify all available amenities and facilities');
    }

    // Contact Information (5 points)
    if (plot.phone_primary && plot.seller_email) {
      score += 5;
    } else {
      suggestions.push('Add complete contact information');
    }

    // Update score in database
    await supabaseClient
      .from('plots')
      .update({ listing_score: score })
      .eq('id', plotId);

    return new Response(
      JSON.stringify({ 
        score, 
        suggestions,
        message: score >= 80 ? 'Excellent listing!' : score >= 60 ? 'Good listing, but can be improved' : 'Needs improvement'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error calculating score:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
