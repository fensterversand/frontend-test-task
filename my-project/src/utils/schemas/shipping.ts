import { z } from 'zod';

export const shippingFormSchema = z.object({
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'City can only contain letters, spaces, hyphens and apostrophes')
    .trim(),
  state: z.string().min(1, 'State is required').trim(),
  zipCode: z.string().regex(/^\d{5}$/, 'Zip code must be 5 digits'),
});
