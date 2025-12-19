import { z } from 'zod';

// Phone number validation (Indian format)
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

export const addPlotValidationSchema = {
  // Step 1: Seller Details
  step1: z.object({
    seller_type: z.string().min(1, 'Please select seller type'),
    seller_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    phone_primary: z.string().trim().regex(phoneRegex, 'Please enter a valid phone number'),
    phone_secondary: z.string().optional(),
    seller_email: z.string().trim().email('Please enter a valid email address'),
  }),

  // Step 2: Basic Plot Details
  step2: z.object({
    title: z.string().trim().min(10, 'Title must be at least 10 characters').max(150, 'Title must be less than 150 characters'),
    plot_type: z.string().min(1, 'Please select plot type'),
    plot_area_value: z.string().min(1, 'Please enter plot area').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Plot area must be a positive number'),
    plot_area_unit: z.string().min(1, 'Please select area unit'),
  }),

  // Step 4: Location Details
  step4: z.object({
    state: z.string().trim().min(2, 'State is required'),
    city: z.string().trim().min(2, 'City is required'),
    locality: z.string().trim().min(2, 'Locality is required'),
    location: z.string().trim().min(2, 'Location is required'),
  }),

  // Step 5: Pricing Details
  step5: z.object({
    price: z.string().min(1, 'Price is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  }),
};

export const validateStep = (step: number, formData: any): { success: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  try {
    switch (step) {
      case 1:
        addPlotValidationSchema.step1.parse({
          seller_type: formData.seller_type,
          seller_name: formData.seller_name,
          phone_primary: formData.phone_primary,
          phone_secondary: formData.phone_secondary,
          seller_email: formData.seller_email,
        });
        break;
      case 2:
        addPlotValidationSchema.step2.parse({
          title: formData.title,
          plot_type: formData.plot_type,
          plot_area_value: formData.plot_area_value,
          plot_area_unit: formData.plot_area_unit,
        });
        break;
      case 4:
        addPlotValidationSchema.step4.parse({
          state: formData.state,
          city: formData.city,
          locality: formData.locality,
          location: formData.location,
        });
        break;
      case 5:
        addPlotValidationSchema.step5.parse({
          price: formData.price,
        });
        break;
      default:
        return { success: true, errors: {} };
    }
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
    }
    return { success: false, errors };
  }
};
