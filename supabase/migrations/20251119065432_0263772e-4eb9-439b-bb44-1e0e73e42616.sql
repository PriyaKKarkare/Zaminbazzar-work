-- Drop the existing check constraint
ALTER TABLE plots DROP CONSTRAINT IF EXISTS plots_plot_type_check;

-- Add updated check constraint with correct values
ALTER TABLE plots ADD CONSTRAINT plots_plot_type_check 
CHECK (plot_type = ANY (ARRAY[
  'Residential Plot'::text,
  'NA Plot'::text,
  'Agricultural Plot'::text,
  'Industrial Plot'::text,
  'Farm Land'::text,
  'Commercial Plot'::text
]));