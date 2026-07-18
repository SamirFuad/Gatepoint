// =============================================================
// Gatepoint — Application Constants
// =============================================================
// Centralized constants to avoid magic strings throughout the codebase.
// =============================================================

// ---- Application ----
export const APP_NAME = 'Gatepoint';
export const APP_DESCRIPTION =
  'Cloud-based Event Registration Platform';

// ---- Routes ----
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Protected — Onboarding
  CREATE_ORGANIZATION: '/create-organization',

  // Protected — Dashboard
  DASHBOARD: '/dashboard',

  // Protected — Events
  EVENTS: '/events',
  NEW_EVENT: '/events/new',
  EVENT_DETAIL: (eventId: string) => `/events/${eventId}` as const,
  EVENT_ATTENDEES: (eventId: string) =>
    `/events/${eventId}/attendees` as const,
  EVENT_REGISTRATIONS: (eventId: string) =>
    `/events/${eventId}/registrations` as const,
  EVENT_SETTINGS: (eventId: string) =>
    `/events/${eventId}/settings` as const,
  EVENT_LANDING_PAGE: (eventId: string) =>
    `/events/${eventId}/landing-page` as const,

  // Protected — Organization
  ORGANIZATION_SETTINGS: '/organization/settings',
  ORGANIZATION_MEMBERS: '/organization/members',

  // Public — Event Pages
  PUBLIC_EVENT: (slug: string) => `/events/${slug}` as const,
  PUBLIC_REGISTER: (slug: string) => `/events/${slug}/register` as const,
} as const;

// ---- Auth ----
export const AUTH_COOKIE_NAME = 'sb-auth-token';
export const SESSION_EXPIRY_SECONDS = 60 * 60; // 1 hour

// ---- Organization Roles ----
export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  STAFF: 'staff', // Future
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ---- Event Status ----
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type EventStatus =
  (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

// ---- Event Types ----
export const EVENT_TYPES = {
  CONFERENCE: 'conference',
  WORKSHOP: 'workshop',
  SEMINAR: 'seminar',
  WEBINAR: 'webinar',
  EXHIBITION: 'exhibition',
  MEETUP: 'meetup',
  CORPORATE: 'corporate',
  GOVERNMENT: 'government',
  ACADEMIC: 'academic',
  OTHER: 'other',
} as const;

export type EventType =
  (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

// ---- Registration Status ----
export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  WAITLISTED: 'waitlisted',
  CHECKED_IN: 'checked_in', // Future
} as const;

export type RegistrationStatus =
  (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS];

// ---- Form Field Types ----
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PHONE: 'phone',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTI_SELECT: 'multi_select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  DATE: 'date',
  NUMBER: 'number',
  URL: 'url',
  FILE: 'file', // Future
} as const;

export type FieldType =
  (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

// ---- Storage ----
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  ORG_LOGOS: 'org-logos',
  EVENT_IMAGES: 'event-images',
  QR_CODES: 'qr-codes',
} as const;

// ---- File Upload Limits ----
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

// ---- Pagination ----
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
