
-- Temporarily drop the foreign key constraints to allow demo data
ALTER TABLE public.plots DROP CONSTRAINT IF EXISTS plots_user_id_fkey;
ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS blogs_user_id_fkey;

-- Insert 6 demo blog posts
INSERT INTO public.blogs (title, slug, content, excerpt, author_name, user_id, published, cover_image) VALUES
(
  'Investing in Mahamumbai: Your Complete Guide',
  'investing-in-mahamumbai-complete-guide',
  'Mahamumbai, the extended metropolitan region of Mumbai, presents unprecedented opportunities for real estate investment. With infrastructure development accelerating and connectivity improving, this region is becoming the hotspot for savvy investors. This comprehensive guide walks you through everything you need to know about investing in Mahamumbai plots.',
  'Discover why Mahamumbai is the next big investment destination for real estate.',
  'Rajesh Kumar',
  '00000000-0000-0000-0000-000000000001',
  true,
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
),
(
  'Understanding ROI in Plot Investments',
  'understanding-roi-plot-investments',
  'Return on Investment (ROI) is crucial when investing in plots. Learn how to calculate ROI, what factors affect it, and how to maximize your returns. We cover appreciation rates, rental yields, development potential, and market timing to help you make informed decisions.',
  'Master the art of calculating and maximizing ROI on your plot investments.',
  'Priya Sharma',
  '00000000-0000-0000-0000-000000000001',
  true,
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
),
(
  'Top 5 Locations in Mahamumbai for Plot Investment',
  'top-5-locations-mahamumbai-plot-investment',
  'Not all locations in Mahamumbai offer the same returns. We analyze the top 5 emerging areas including Panvel, Kalyan, Dombivli, Navi Mumbai, and Thane. Each location is evaluated based on infrastructure development, connectivity, appreciation potential, and current market rates.',
  'Explore the most promising locations in Mahamumbai for your next plot purchase.',
  'Amit Patel',
  '00000000-0000-0000-0000-000000000001',
  true,
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
),
(
  'Legal Checklist Before Buying Land in Maharashtra',
  'legal-checklist-buying-land-maharashtra',
  'Buying land involves complex legal procedures. This detailed checklist covers title verification, 7/12 extracts, NA permissions, encumbrance certificates, and more. Protect yourself from legal disputes with our comprehensive guide to due diligence in Maharashtra.',
  'Essential legal documents and verifications every land buyer must complete.',
  'Advocate Meera Desai',
  '00000000-0000-0000-0000-000000000001',
  true,
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'
),
(
  'Agricultural vs. Non-Agricultural Land: What You Need to Know',
  'agricultural-vs-non-agricultural-land-guide',
  'Understanding the difference between agricultural and non-agricultural (NA) land is crucial for investors. We explain conversion processes, regulations, investment implications, and how to identify the right type of land for your needs.',
  'Navigate the complexities of agricultural and NA land classifications.',
  'Vikram Singh',
  '00000000-0000-0000-0000-000000000001',
  true,
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
),
(
  'Future Infrastructure Projects Boosting Mahamumbai Real Estate',
  'future-infrastructure-projects-mahamumbai',
  'Mumbai Trans Harbour Link, coastal road, metro expansions, and new airport developments are transforming Mahamumbai. Learn how these mega infrastructure projects will impact property values and which areas will benefit the most.',
  'How upcoming infrastructure is reshaping Mahamumbai''s real estate landscape.',
  'Dr. Sunita Joshi',
  '00000000-0000-0000-0000-000000000001',
  true,
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'
);

-- Insert 6 demo property plots
INSERT INTO public.plots (title, location, price, area, dimensions, plot_type, description, property_status, user_id, image_url, bedrooms, bathrooms, amenities) VALUES
(
  'Premium Residential Plot in Panvel',
  'Panvel, Navi Mumbai',
  4500000,
  '1200 sq.ft',
  '30x40 ft',
  'Residential',
  'Well-located residential plot in the heart of Panvel. Close to schools, hospitals, and shopping centers. Clear title with all necessary approvals. Ideal for building your dream home.',
  'available',
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
  null,
  null,
  ARRAY['Clear Title', 'NA Approved', 'Gated Community', 'Water Supply', 'Electricity']
),
(
  'Commercial Plot Near Kalyan Station',
  'Kalyan, Thane',
  8500000,
  '2000 sq.ft',
  '40x50 ft',
  'Commercial',
  'Prime commercial plot located just 500 meters from Kalyan railway station. High footfall area perfect for retail or office space. Excellent investment opportunity with high rental potential.',
  'available',
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  null,
  null,
  ARRAY['Corner Plot', 'Wide Road Access', 'Commercial Zone', 'High Footfall']
),
(
  'Agricultural Land in Karjat Valley',
  'Karjat, Raigad',
  2500000,
  '5000 sq.ft',
  '50x100 ft',
  'Agricultural',
  'Scenic agricultural land in the beautiful Karjat valley. Perfect for farming, weekend getaway, or future investment. Access to water and basic utilities available.',
  'available',
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  null,
  null,
  ARRAY['Scenic View', 'Water Access', 'Fertile Soil', 'Peaceful Location']
),
(
  'Spacious Plot in Dombivli East',
  'Dombivli, Thane',
  5200000,
  '1500 sq.ft',
  '30x50 ft',
  'Residential',
  'Excellent residential plot in developing area of Dombivli East. Close to upcoming metro station. Society amenities include park, security, and underground drainage.',
  'available',
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  null,
  null,
  ARRAY['Gated Society', 'Park', '24/7 Security', 'Underground Drainage', 'Street Lights']
),
(
  'Investment Plot Near Navi Mumbai Airport',
  'Ulwe, Navi Mumbai',
  6500000,
  '1800 sq.ft',
  '36x50 ft',
  'Residential',
  'Strategic plot near the upcoming Navi Mumbai International Airport. This area is set for massive appreciation. Perfect for long-term investment or building a modern home.',
  'available',
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c9750?w=800',
  null,
  null,
  ARRAY['Near Airport', 'Development Zone', 'Good Connectivity', 'Investment Hotspot']
),
(
  'Corner Plot in Thane West',
  'Thane West, Thane',
  7800000,
  '2200 sq.ft',
  '44x50 ft',
  'Residential',
  'Premium corner plot in established residential area of Thane West. Two side open with excellent ventilation. Walking distance to schools, hospitals, and markets.',
  'available',
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  null,
  null,
  ARRAY['Corner Plot', 'Two Side Open', 'Established Area', 'All Amenities Nearby']
);

-- Re-add the foreign key constraints as NOT VALID (applies only to new data)
ALTER TABLE public.plots 
ADD CONSTRAINT plots_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE 
NOT VALID;

ALTER TABLE public.blogs 
ADD CONSTRAINT blogs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE 
NOT VALID;
