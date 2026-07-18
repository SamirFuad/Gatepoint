import { z } from 'zod';
import { EVENT_STATUS, EVENT_TYPES } from '@/lib/constants';

const optionalDateTime = z.string().trim().optional().or(z.literal(''));

export const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Event title is required.')
      .max(160, 'Title must be 160 characters or fewer.'),
    slug: z
      .string()
      .trim()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Use lowercase letters, numbers, and single hyphens.'
      )
      .optional()
      .or(z.literal('')),
    description: z
      .string()
      .trim()
      .max(2000, 'Description must be 2,000 characters or fewer.')
      .optional()
      .or(z.literal('')),
    eventType: z.enum([
      EVENT_TYPES.CONFERENCE,
      EVENT_TYPES.WORKSHOP,
      EVENT_TYPES.SEMINAR,
      EVENT_TYPES.WEBINAR,
      EVENT_TYPES.EXHIBITION,
      EVENT_TYPES.MEETUP,
      EVENT_TYPES.CORPORATE,
      EVENT_TYPES.GOVERNMENT,
      EVENT_TYPES.ACADEMIC,
      EVENT_TYPES.OTHER,
    ]),
    venueName: z.string().trim().max(160).optional().or(z.literal('')),
    venueAddress: z.string().trim().max(300).optional().or(z.literal('')),
    timezone: z.string().trim().min(1, 'Timezone is required.'),
    startsAt: z.string().trim().min(1, 'Start date is required.'),
    endsAt: z.string().trim().min(1, 'End date is required.'),
    registrationOpensAt: optionalDateTime,
    registrationClosesAt: optionalDateTime,
    maxAttendees: z.coerce
      .number()
      .int()
      .positive('Capacity must be greater than zero.')
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
    path: ['endsAt'],
    message: 'End date must be after the start date.',
  });

export const updateEventSchema = eventSchema.extend({
  status: z
    .enum([
      EVENT_STATUS.DRAFT,
      EVENT_STATUS.PUBLISHED,
      EVENT_STATUS.CANCELLED,
      EVENT_STATUS.COMPLETED,
    ])
    .optional(),
});

export const eventIdSchema = z.object({
  eventId: z.string().uuid(),
});

export type EventInput = z.infer<typeof eventSchema>;

