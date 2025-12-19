import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, X, ChevronRight, ChevronLeft, ImagePlus } from 'lucide-react';
import { validateStep } from '@/lib/validation';

const AddPlot = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sellerDetailsLoaded, setSellerDetailsLoaded] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state - MUST be declared before any conditional returns
  const [formData, setFormData] = useState({
    // Section 1: Seller Details
    seller_type: '',
    seller_name: '',
    phone_primary: '',
    phone_secondary: '',
    seller_email: '',

    // Section 2: Basic Plot Details
    title: '',
    plot_type: '',
    plot_area_value: '',
    plot_area_unit: 'Sq. Ft',
    plot_length: '',
    plot_width: '',
    plot_facing: '',
    plot_shape: '',
    road_access: true,
    road_width: '',
    is_gated: false,
    gated_project_name: '',

    // Section 3: Land Legality
    land_classification: '',
    ownership_type: '',
    encumbrance_status: '',
    has_fencing: false,

    // Section 4: Location
    state: '',
    city: '',
    locality: '',
    taluka: '',
    location: '',
    exact_address: '',
    google_map_pin: '',
    nearby_landmark: '',
    zone_type: '',

    // Section 5: Pricing
    price: '',
    price_per_unit: '',
    is_negotiable: false,
    booking_amount: '',
    loan_available: false,
    loan_banks: '',
    gst_applicable: false,

    // Section 6: Amenities
    has_compound_wall: false,
    has_security_gate: false,
    has_internal_roads: false,
    has_electricity: false,
    has_water_supply: false,
    has_drainage: false,
    has_street_lights: false,
    has_garden: false,
    has_clubhouse: false,
    has_parking: false,
    has_cctv: false,
    has_rainwater_harvesting: false,

    // Section 7: Media
    walkthrough_video_url: '',
    virtual_tour_360_url: '',

    // Section 8: Additional
    availability_status: 'available',
    possession_timeline: '',
    reason_for_selling: '',
    description: '',

    // Section 9: Verification & Boost
    is_premium_listing: false,
    is_verified_owner: false,
    is_urgent_sale: false,

    // Other fields
    property_status: 'available',
    listing_status: 'draft',
    area: ''
  });

  // Fetch existing plot data for editing
  useEffect(() => {
    const fetchPlotData = async () => {
      if (!editId || !user) return;

      try {
        const { data, error } = await supabase
          .from('plots')
          .select('*')
          .eq('id', editId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setIsEditMode(true);
          // Pre-fill form with existing data
          setFormData({
            seller_type: data.seller_type || '',
            seller_name: data.seller_name || '',
            phone_primary: data.phone_primary || '',
            phone_secondary: data.phone_secondary || '',
            seller_email: data.seller_email || '',
            title: data.title || '',
            plot_type: data.plot_type || '',
            plot_area_value: data.plot_area_value?.toString() || '',
            plot_area_unit: data.plot_area_unit || 'Sq. Ft',
            plot_length: data.plot_length || '',
            plot_width: data.plot_width || '',
            plot_facing: data.plot_facing || '',
            plot_shape: data.plot_shape || '',
            road_access: data.road_access !== false,
            road_width: data.road_width || '',
            is_gated: data.is_gated || false,
            gated_project_name: data.gated_project_name || '',
            land_classification: data.land_classification || '',
            ownership_type: data.ownership_type || '',
            encumbrance_status: data.encumbrance_status || '',
            has_fencing: data.has_fencing || false,
            state: data.state || '',
            city: data.city || '',
            locality: data.locality || '',
            taluka: data.taluka || '',
            location: data.location || '',
            exact_address: data.exact_address || '',
            google_map_pin: data.google_map_pin || '',
            nearby_landmark: data.nearby_landmark || '',
            zone_type: data.zone_type || '',
            price: data.price?.toString() || '',
            price_per_unit: data.price_per_unit?.toString() || '',
            is_negotiable: data.is_negotiable || false,
            booking_amount: data.booking_amount?.toString() || '',
            loan_available: data.loan_available || false,
            loan_banks: data.loan_banks || '',
            gst_applicable: data.gst_applicable || false,
            has_compound_wall: data.has_compound_wall || false,
            has_security_gate: data.has_security_gate || false,
            has_internal_roads: data.has_internal_roads || false,
            has_electricity: data.has_electricity || false,
            has_water_supply: data.has_water_supply || false,
            has_drainage: data.has_drainage || false,
            has_street_lights: data.has_street_lights || false,
            has_garden: data.has_garden || false,
            has_clubhouse: data.has_clubhouse || false,
            has_parking: data.has_parking || false,
            has_cctv: data.has_cctv || false,
            has_rainwater_harvesting: data.has_rainwater_harvesting || false,
            walkthrough_video_url: data.walkthrough_video_url || '',
            virtual_tour_360_url: data.virtual_tour_360_url || '',
            availability_status: data.availability_status || 'available',
            possession_timeline: data.possession_timeline || '',
            reason_for_selling: data.reason_for_selling || '',
            description: data.description || '',
            is_premium_listing: data.is_premium_listing || false,
            is_verified_owner: data.is_verified_owner || false,
            is_urgent_sale: data.is_urgent_sale || false,
            property_status: data.property_status || 'available',
            listing_status: data.listing_status || 'draft',
            area: data.area || ''
          });

          // Pre-fill existing images
          if (data.images && data.images.length > 0) {
            setImagePreviews(data.images);
          }

          toast.success('Property data loaded for editing');
        }
      } catch (error: any) {
        console.error('Error fetching plot data:', error);
        toast.error('Failed to load property data');
        navigate('/seller-dashboard');
      }
    };

    if (editId && user && !authLoading) {
      fetchPlotData();
    }
  }, [editId, user, authLoading, navigate]);

  // Fetch seller details from previous listings
  useEffect(() => {
    // Skip if we're in edit mode (data already loaded)
    if (isEditMode) return;

    const fetchPreviousSellerDetails = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('plots')
          .select('seller_type, seller_name, phone_primary, phone_secondary, seller_email')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          // Auto-fill seller details from previous listing
          setFormData(prev => ({
            ...prev,
            seller_type: data.seller_type || '',
            seller_name: data.seller_name || '',
            phone_primary: data.phone_primary || '',
            phone_secondary: data.phone_secondary || '',
            seller_email: data.seller_email || user.email || '',
          }));
          setSellerDetailsLoaded(true);
          
          // If all seller details are present, start from step 2
          if (data.seller_type && data.seller_name && data.phone_primary) {
            setCurrentStep(2);
            toast.success('Seller details loaded from your previous listing');
          }
        } else {
          // If no previous listings, set email from user profile
          setFormData(prev => ({
            ...prev,
            seller_email: user.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching seller details:', error);
        // Set email even if fetch fails
        setFormData(prev => ({
          ...prev,
          seller_email: user.email || '',
        }));
      }
    };

    if (user && !authLoading) {
      fetchPreviousSellerDetails();
    }
  }, [user, authLoading]);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Update file array
    const newFiles = [...imageFiles];
    newFiles[slotIndex] = file;
    setImageFiles(newFiles);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[slotIndex] = reader.result as string;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Update file array
    const newFiles = [...imageFiles];
    newFiles[slotIndex] = file;
    setImageFiles(newFiles);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[slotIndex] = reader.result as string;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles[index] = null as any;
    newPreviews[index] = '';
    setImageFiles(newFiles.filter(f => f !== null));
    setImagePreviews(newPreviews.filter(p => p !== ''));
  };

  const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = imageFiles.filter(f => f).length + files.length;
    
    if (totalImages > 20) {
      toast.error('Maximum 20 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const finalUrls: string[] = [];
    
    // Combine existing image URLs (from edit mode) with new uploads
    for (let i = 0; i < imagePreviews.length; i++) {
      const preview = imagePreviews[i];
      const file = imageFiles[i];
      
      // If we have a file at this index, upload it
      if (file) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user!.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            // Keep existing preview if upload fails
            if (preview) finalUrls.push(preview);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);

          finalUrls.push(publicUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          // Keep existing preview if upload fails
          if (preview) finalUrls.push(preview);
        }
      } else if (preview) {
        // Keep existing URL if no new file
        finalUrls.push(preview);
      }
    }

    return finalUrls;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      const plotData = {
        user_id: user!.id,
        ...formData,
        price: parseFloat(formData.price) || 0,
        plot_area_value: parseFloat(formData.plot_area_value) || 0,
        price_per_unit: parseFloat(formData.price_per_unit) || 0,
        booking_amount: parseFloat(formData.booking_amount) || 0,
        area: `${formData.plot_area_value} ${formData.plot_area_unit}`,
        images: imageUrls,
        listing_status: status,
        status: status === 'published' ? 'active' : 'draft'
      };

      if (isEditMode && editId) {
        // Update existing plot
        const { error } = await supabase
          .from('plots')
          .update(plotData)
          .eq('id', editId)
          .eq('user_id', user!.id);

        if (error) throw error;

        toast.success('Property updated successfully!');
      } else {
        // Insert new plot
        const { error } = await supabase
          .from('plots')
          .insert([plotData]);

        if (error) throw error;

        toast.success(status === 'published' ? 'Property published successfully!' : 'Draft saved successfully!');
      }

      navigate('/seller-dashboard');
    } catch (error: any) {
      console.error('Error submitting:', error);
      toast.error(error.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    // Validate current step
    const validation = validateStep(currentStep, formData);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      toast.error('Please fix the validation errors before continuing');
      return;
    }
    
    // Clear validation errors if validation passes
    setValidationErrors({});
    
    // Validate Step 7 - require 4 images (includes existing images in edit mode)
    if (currentStep === 7) {
      if (imagePreviews.length < 4) {
        toast.error('Please upload at least 4 images to continue');
        return;
      }
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{isEditMode ? 'Edit Property' : 'Add New Property'}</h1>
          <p className="text-muted-foreground">{isEditMode ? 'Update your property details' : 'Fill in the details to list your property'}</p>
          
          <div className="mt-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Seller Details"}
              {currentStep === 2 && "Basic Plot Details"}
              {currentStep === 3 && "Land Legality & Documents"}
              {currentStep === 4 && "Location Details"}
              {currentStep === 5 && "Pricing Details"}
              {currentStep === 6 && "Amenities & Features"}
              {currentStep === 7 && "Photos & Media"}
              {currentStep === 8 && "Additional Details"}
              {currentStep === 9 && "Verification & Boost Options"}
              {currentStep === 10 && "Final Review & Publish"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Provide your contact and verification details"}
              {currentStep === 2 && "Enter basic information about the plot"}
              {currentStep === 3 && "Upload legal documents and ownership details"}
              {currentStep === 4 && "Specify the exact location"}
              {currentStep === 5 && "Set your pricing and payment terms"}
              {currentStep === 6 && "Select available amenities"}
              {currentStep === 7 && "Upload property images and media"}
              {currentStep === 8 && "Add any additional information"}
              {currentStep === 9 && "Boost your listing visibility"}
              {currentStep === 10 && "Review and publish your listing"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Section 1: Seller Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {sellerDetailsLoaded && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Seller Details Auto-Filled</h4>
                      <p className="text-sm text-muted-foreground">
                        Your details have been loaded from your previous listing. You can edit them if needed or click "Next" to continue.
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <Label>Seller Type *</Label>
                  <RadioGroup 
                    value={formData.seller_type} 
                    onValueChange={(value) => handleInputChange('seller_type', value)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="owner" id="owner" />
                      <Label htmlFor="owner">Owner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="broker" id="broker" />
                      <Label htmlFor="broker">Broker/Agent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developer" id="developer" />
                      <Label htmlFor="developer">Builder/Developer</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="seller_name">Seller Name *</Label>
                  <Input
                    id="seller_name"
                    value={formData.seller_name}
                    onChange={(e) => handleInputChange('seller_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {validationErrors.seller_name && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.seller_name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone_primary">Phone Number (Primary) *</Label>
                    <Input
                      id="phone_primary"
                      value={formData.phone_primary}
                      onChange={(e) => handleInputChange('phone_primary', e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                    {validationErrors.phone_primary && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.phone_primary}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone_secondary">Secondary Number (Optional)</Label>
                    <Input
                      id="phone_secondary"
                      value={formData.phone_secondary}
                      onChange={(e) => handleInputChange('phone_secondary', e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="seller_email">Email Address *</Label>
                  <Input
                    id="seller_email"
                    type="email"
                    value={formData.seller_email}
                    onChange={(e) => handleInputChange('seller_email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                  {validationErrors.seller_email && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.seller_email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: Basic Plot Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Listing Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., East-Facing Residential Plot for Sale in Wagholi, Pune"
                    maxLength={150}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/150 characters</p>
                  {validationErrors.title && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="plot_type">Plot Type *</Label>
                  <Select value={formData.plot_type} onValueChange={(value) => handleInputChange('plot_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plot type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential Plot">Residential Plot</SelectItem>
                      <SelectItem value="NA Plot">NA Plot</SelectItem>
                      <SelectItem value="Agricultural Plot">Agricultural Plot</SelectItem>
                      <SelectItem value="Industrial Plot">Industrial Plot</SelectItem>
                      <SelectItem value="Farm Land">Farm Land</SelectItem>
                      <SelectItem value="Commercial Plot">Commercial Plot</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.plot_type && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.plot_type}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plot_area_value">Total Plot Area *</Label>
                    <Input
                      id="plot_area_value"
                      type="number"
                      value={formData.plot_area_value}
                      onChange={(e) => handleInputChange('plot_area_value', e.target.value)}
                      placeholder="Enter area"
                    />
                    {validationErrors.plot_area_value && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.plot_area_value}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="plot_area_unit">Unit *</Label>
                    <Select value={formData.plot_area_unit} onValueChange={(value) => handleInputChange('plot_area_unit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sq. Ft">Sq. Ft</SelectItem>
                        <SelectItem value="Sq. Yard">Sq. Yard</SelectItem>
                        <SelectItem value="Guntha">Guntha</SelectItem>
                        <SelectItem value="Acre">Acre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plot_length">Length (ft)</Label>
                    <Input
                      id="plot_length"
                      value={formData.plot_length}
                      onChange={(e) => handleInputChange('plot_length', e.target.value)}
                      placeholder="e.g., 50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="plot_width">Width (ft)</Label>
                    <Input
                      id="plot_width"
                      value={formData.plot_width}
                      onChange={(e) => handleInputChange('plot_width', e.target.value)}
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>

                <div>
                  <Label>Plot Facing Direction</Label>
                  <Select value={formData.plot_facing} onValueChange={(value) => handleInputChange('plot_facing', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="Northeast">Northeast</SelectItem>
                      <SelectItem value="Northwest">Northwest</SelectItem>
                      <SelectItem value="Southeast">Southeast</SelectItem>
                      <SelectItem value="Southwest">Southwest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Plot Shape</Label>
                  <Select value={formData.plot_shape} onValueChange={(value) => handleInputChange('plot_shape', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Square">Square</SelectItem>
                      <SelectItem value="Rectangular">Rectangular</SelectItem>
                      <SelectItem value="Irregular">Irregular</SelectItem>
                      <SelectItem value="L-Shape">L-Shape</SelectItem>
                      <SelectItem value="Triangular">Triangular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="road_access"
                      checked={formData.road_access}
                      onCheckedChange={(checked) => handleInputChange('road_access', checked)}
                    />
                    <Label htmlFor="road_access">Has Road Access</Label>
                  </div>

                  {formData.road_access && (
                    <div>
                      <Label>Road Width</Label>
                      <Select value={formData.road_width} onValueChange={(value) => handleInputChange('road_width', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select width" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10 ft">10 ft</SelectItem>
                          <SelectItem value="20 ft">20 ft</SelectItem>
                          <SelectItem value="30 ft">30 ft</SelectItem>
                          <SelectItem value="40 ft">40 ft</SelectItem>
                          <SelectItem value="60 ft">60 ft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_gated"
                    checked={formData.is_gated}
                    onCheckedChange={(checked) => handleInputChange('is_gated', checked)}
                  />
                  <Label htmlFor="is_gated">Is It Gated Community?</Label>
                </div>

                {formData.is_gated && (
                  <div>
                    <Label htmlFor="gated_project_name">Project Name</Label>
                    <Input
                      id="gated_project_name"
                      value={formData.gated_project_name}
                      onChange={(e) => handleInputChange('gated_project_name', e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Land Legality & Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="land_classification">Land Classification</Label>
                  <Select value={formData.land_classification} onValueChange={(value) => handleInputChange('land_classification', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ownership_type">Ownership Type</Label>
                  <Select value={formData.ownership_type} onValueChange={(value) => handleInputChange('ownership_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freehold">Freehold</SelectItem>
                      <SelectItem value="Leasehold">Leasehold</SelectItem>
                      <SelectItem value="Co-operative Society">Co-operative Society</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="encumbrance_status">Encumbrance Status</Label>
                  <Select value={formData.encumbrance_status} onValueChange={(value) => handleInputChange('encumbrance_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clear">Clear</SelectItem>
                      <SelectItem value="Encumbered">Encumbered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_fencing"
                    checked={formData.has_fencing}
                    onCheckedChange={(checked) => handleInputChange('has_fencing', checked)}
                  />
                  <Label htmlFor="has_fencing">Has Fencing</Label>
                </div>
              </div>
            )}

            {/* Section 4: Location Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                  {validationErrors.state && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.state}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                  {validationErrors.city && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="locality">Locality *</Label>
                  <Input
                    id="locality"
                    value={formData.locality}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                    placeholder="Enter locality"
                  />
                  {validationErrors.locality && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.locality}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="taluka">Taluka</Label>
                  <Input
                    id="taluka"
                    value={formData.taluka}
                    onChange={(e) => handleInputChange('taluka', e.target.value)}
                    placeholder="Enter taluka"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location"
                  />
                  {validationErrors.location && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.location}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="exact_address">Exact Address</Label>
                  <Textarea
                    id="exact_address"
                    value={formData.exact_address}
                    onChange={(e) => handleInputChange('exact_address', e.target.value)}
                    placeholder="Enter exact address"
                  />
                </div>

                <div>
                  <Label htmlFor="google_map_pin">Google Map Pin</Label>
                  <Input
                    id="google_map_pin"
                    value={formData.google_map_pin}
                    onChange={(e) => handleInputChange('google_map_pin', e.target.value)}
                    placeholder="Enter Google Map pin URL"
                  />
                </div>

                <div>
                  <Label htmlFor="nearby_landmark">Nearby Landmark</Label>
                  <Input
                    id="nearby_landmark"
                    value={formData.nearby_landmark}
                    onChange={(e) => handleInputChange('nearby_landmark', e.target.value)}
                    placeholder="Enter nearby landmark"
                  />
                </div>

                <div>
                  <Label htmlFor="zone_type">Zone Type</Label>
                  <Select value={formData.zone_type} onValueChange={(value) => handleInputChange('zone_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Section 5: Pricing Details */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                  />
                  {validationErrors.price && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price_per_unit">Price Per Unit</Label>
                  <Input
                    id="price_per_unit"
                    type="number"
                    value={formData.price_per_unit}
                    onChange={(e) => handleInputChange('price_per_unit', e.target.value)}
                    placeholder="Enter price per unit"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_negotiable"
                    checked={formData.is_negotiable}
                    onCheckedChange={(checked) => handleInputChange('is_negotiable', checked)}
                  />
                  <Label htmlFor="is_negotiable">Is Price Negotiable?</Label>
                </div>

                <div>
                  <Label htmlFor="booking_amount">Booking Amount</Label>
                  <Input
                    id="booking_amount"
                    type="number"
                    value={formData.booking_amount}
                    onChange={(e) => handleInputChange('booking_amount', e.target.value)}
                    placeholder="Enter booking amount"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="loan_available"
                    checked={formData.loan_available}
                    onCheckedChange={(checked) => handleInputChange('loan_available', checked)}
                  />
                  <Label htmlFor="loan_available">Loan Available?</Label>
                </div>

                {formData.loan_available && (
                  <div>
                    <Label htmlFor="loan_banks">Loan Banks</Label>
                    <Input
                      id="loan_banks"
                      value={formData.loan_banks}
                      onChange={(e) => handleInputChange('loan_banks', e.target.value)}
                      placeholder="Enter banks offering loan"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gst_applicable"
                    checked={formData.gst_applicable}
                    onCheckedChange={(checked) => handleInputChange('gst_applicable', checked)}
                  />
                  <Label htmlFor="gst_applicable">GST Applicable?</Label>
                </div>
              </div>
            )}

            {/* Section 6: Amenities & Features */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_compound_wall"
                    checked={formData.has_compound_wall}
                    onCheckedChange={(checked) => handleInputChange('has_compound_wall', checked)}
                  />
                  <Label htmlFor="has_compound_wall">Compound Wall</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_security_gate"
                    checked={formData.has_security_gate}
                    onCheckedChange={(checked) => handleInputChange('has_security_gate', checked)}
                  />
                  <Label htmlFor="has_security_gate">Security Gate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_internal_roads"
                    checked={formData.has_internal_roads}
                    onCheckedChange={(checked) => handleInputChange('has_internal_roads', checked)}
                  />
                  <Label htmlFor="has_internal_roads">Internal Roads</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_electricity"
                    checked={formData.has_electricity}
                    onCheckedChange={(checked) => handleInputChange('has_electricity', checked)}
                  />
                  <Label htmlFor="has_electricity">Electricity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_water_supply"
                    checked={formData.has_water_supply}
                    onCheckedChange={(checked) => handleInputChange('has_water_supply', checked)}
                  />
                  <Label htmlFor="has_water_supply">Water Supply</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_drainage"
                    checked={formData.has_drainage}
                    onCheckedChange={(checked) => handleInputChange('has_drainage', checked)}
                  />
                  <Label htmlFor="has_drainage">Drainage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_street_lights"
                    checked={formData.has_street_lights}
                    onCheckedChange={(checked) => handleInputChange('has_street_lights', checked)}
                  />
                  <Label htmlFor="has_street_lights">Street Lights</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_garden"
                    checked={formData.has_garden}
                    onCheckedChange={(checked) => handleInputChange('has_garden', checked)}
                  />
                  <Label htmlFor="has_garden">Garden</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_clubhouse"
                    checked={formData.has_clubhouse}
                    onCheckedChange={(checked) => handleInputChange('has_clubhouse', checked)}
                  />
                  <Label htmlFor="has_clubhouse">Clubhouse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_parking"
                    checked={formData.has_parking}
                    onCheckedChange={(checked) => handleInputChange('has_parking', checked)}
                  />
                  <Label htmlFor="has_parking">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_cctv"
                    checked={formData.has_cctv}
                    onCheckedChange={(checked) => handleInputChange('has_cctv', checked)}
                  />
                  <Label htmlFor="has_cctv">CCTV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_rainwater_harvesting"
                    checked={formData.has_rainwater_harvesting}
                    onCheckedChange={(checked) => handleInputChange('has_rainwater_harvesting', checked)}
                  />
                  <Label htmlFor="has_rainwater_harvesting">Rainwater Harvesting</Label>
                </div>
              </div>
            )}

            {/* Section 7: Photos & Media */}
            {currentStep === 7 && (
              <div className="space-y-8">
                <div>
                  <Label className="text-lg font-semibold">Property Images *</Label>
                  <p className="text-sm text-muted-foreground mt-1">Upload at least 4 high-quality images of your property</p>
                </div>

                {/* 4 Mandatory Image Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[0, 1, 2, 3].map((slotIndex) => (
                    <div key={slotIndex}>
                      <input
                        type="file"
                        id={`image-upload-${slotIndex}`}
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, slotIndex)}
                        className="hidden"
                      />
                      
                      {imagePreviews[slotIndex] ? (
                        <div className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden border-2 border-primary/20 bg-muted">
                            <img
                              src={imagePreviews[slotIndex]}
                              alt={`Property ${slotIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(slotIndex)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/90"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                            <p className="text-xs font-medium">Image {slotIndex + 1}</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDrop={(e) => handleDrop(e, slotIndex)}
                          onDragOver={handleDragOver}
                          onClick={() => document.getElementById(`image-upload-${slotIndex}`)?.click()}
                          className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
                        >
                          <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                            <ImagePlus className="h-8 w-8 text-primary" />
                          </div>
                          <div className="text-center px-4">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Upload Image {slotIndex + 1}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click or drag & drop
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Images Section */}
                {imageFiles.filter(f => f).length >= 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Additional Images (Optional)</Label>
                      <span className="text-sm text-muted-foreground">
                        {imageFiles.length}/20 images
                      </span>
                    </div>
                    
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all"
                      onClick={() => document.getElementById('additional-images')?.click()}
                    >
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium text-foreground mb-1">Upload More Images</p>
                      <p className="text-xs text-muted-foreground">Add up to {20 - imageFiles.length} more images</p>
                      <input
                        id="additional-images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleAdditionalImages}
                      />
                    </div>

                    {imageFiles.length > 4 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.slice(4).map((preview, idx) => (
                          <div key={idx + 4} className="relative group">
                            <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                              <img
                                src={preview}
                                alt={`Additional ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(idx + 4)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t space-y-4">
                  <div>
                    <Label htmlFor="walkthrough_video_url">Walkthrough Video URL (Optional)</Label>
                    <Input
                      id="walkthrough_video_url"
                      value={formData.walkthrough_video_url}
                      onChange={(e) => handleInputChange('walkthrough_video_url', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="virtual_tour_360_url">360° Virtual Tour URL (Optional)</Label>
                    <Input
                      id="virtual_tour_360_url"
                      value={formData.virtual_tour_360_url}
                      onChange={(e) => handleInputChange('virtual_tour_360_url', e.target.value)}
                      placeholder="https://..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 8: Additional Details */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="availability_status">Availability Status</Label>
                  <Select value={formData.availability_status} onValueChange={(value) => handleInputChange('availability_status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="under_offer">Under Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="possession_timeline">Possession Timeline</Label>
                  <Input
                    id="possession_timeline"
                    value={formData.possession_timeline}
                    onChange={(e) => handleInputChange('possession_timeline', e.target.value)}
                    placeholder="Enter possession timeline"
                  />
                </div>

                <div>
                  <Label htmlFor="reason_for_selling">Reason for Selling</Label>
                  <Textarea
                    id="reason_for_selling"
                    value={formData.reason_for_selling}
                    onChange={(e) => handleInputChange('reason_for_selling', e.target.value)}
                    placeholder="Enter reason for selling"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter detailed description"
                  />
                </div>
              </div>
            )}

            {/* Section 9: Verification & Boost Options */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_premium_listing"
                    checked={formData.is_premium_listing}
                    onCheckedChange={(checked) => handleInputChange('is_premium_listing', checked)}
                  />
                  <Label htmlFor="is_premium_listing">Premium Listing</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_verified_owner"
                    checked={formData.is_verified_owner}
                    onCheckedChange={(checked) => handleInputChange('is_verified_owner', checked)}
                  />
                  <Label htmlFor="is_verified_owner">Verified Owner</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_urgent_sale"
                    checked={formData.is_urgent_sale}
                    onCheckedChange={(checked) => handleInputChange('is_urgent_sale', checked)}
                  />
                  <Label htmlFor="is_urgent_sale">Urgent Sale</Label>
                </div>
              </div>
            )}

            {/* Section 10: Final Review & Publish */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Review Your Listing</h2>
                <p>Please review all the details you have entered before publishing.</p>
                {/* Optionally, display a summary of the formData here */}
                <div className="space-y-2">
                  <p><strong>Seller Type:</strong> {formData.seller_type}</p>
                  <p><strong>Seller Name:</strong> {formData.seller_name}</p>
                  <p><strong>Phone Primary:</strong> {formData.phone_primary}</p>
                  <p><strong>Email:</strong> {formData.seller_email}</p>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Plot Type:</strong> {formData.plot_type}</p>
                  <p><strong>Area:</strong> {formData.plot_area_value} {formData.plot_area_unit}</p>
                  <p><strong>Price:</strong> {formData.price}</p>
                  <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
                  {/* Add more fields as needed */}
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>Edit</Button>
                  <Button onClick={() => handleSubmit('published')} disabled={loading}>
                    {loading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Listing' : 'Publish Listing')}
                  </Button>
                  <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={loading}>
                    {loading ? 'Saving...' : 'Save as Draft'}
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < totalSteps && (
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AddPlot;
