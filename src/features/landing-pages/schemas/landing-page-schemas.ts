import { z } from 'zod';

export const landingPageConfigSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(2, 'Headline is required.')
    .max(140, 'Headline must be 140 characters or fewer.'),
  subheadline: z
    .string()
    .trim()
    .max(300, 'Subheadline must be 300 characters or fewer.')
    .optional()
    .or(z.literal('')),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #4f46e5.'),
  agenda: z
    .string()
    .trim()
    .max(1000, 'Agenda must be 1,000 characters or fewer.')
    .optional()
    .or(z.literal('')),
  venueNote: z
    .string()
    .trim()
    .max(500, 'Venue note must be 500 characters or fewer.')
    .optional()
    .or(z.literal('')),
  contactEmail: z
    .string()
    .trim()
    .email('Enter a valid contact email.')
    .optional()
    .or(z.literal('')),
});

export type LandingPageConfig = z.infer<typeof landingPageConfigSchema>;

export function defaultLandingPageConfig(eventTitle: string): LandingPageConfig {
  return {
    headline: eventTitle,
    subheadline: 'Reserve your place and receive event updates.',
    accentColor: '#4f46e5',
    agenda: '',
    venueNote: '',
    contactEmail: '',
  };
}

