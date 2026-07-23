import { z } from 'zod';

export const agendaItemSchema = z.object({
  time: z
    .string()
    .trim()
    .min(1, 'Time is required.')
    .max(20, 'Time must be 20 characters or fewer.'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title must be 200 characters or fewer.'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or fewer.')
    .optional()
    .or(z.literal('')),
  speaker: z
    .string()
    .trim()
    .max(100, 'Speaker must be 100 characters or fewer.')
    .optional()
    .or(z.literal('')),
});

export type AgendaItem = z.infer<typeof agendaItemSchema>;

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
  agendaItems: z.array(agendaItemSchema).optional(),
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
    agendaItems: [],
  };
}
