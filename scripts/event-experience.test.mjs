import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateImageFile,
  matchesImageSignature,
  isEventImageUrl,
  accentTextColor,
  MAX_IMAGE_BYTES,
} from '../src/features/landing-pages/lib/event-media.ts';
import {
  landingPageConfigSchema,
  defaultLandingPageConfig,
} from '../src/features/landing-pages/schemas/landing-page-schemas.ts';
import {
  eventDateTimeToIso,
  localEventDateTime,
} from '../src/features/events/lib/event-dates.ts';
import { registrationUnavailable } from '../src/features/registrations/lib/registration-availability.ts';
test('uploads reject empty, oversized, unsupported, and disguised files', () => {
  assert.match(validateImageFile({ size: 0, type: 'image/jpeg' }), /Choose/);
  assert.match(
    validateImageFile({ size: MAX_IMAGE_BYTES + 1, type: 'image/jpeg' }),
    /5 MB/
  );
  assert.match(validateImageFile({ size: 100, type: 'image/svg+xml' }), /JPG/);
  assert.equal(validateImageFile({ size: 400, type: 'image/webp' }), null);
  assert.equal(
    matchesImageSignature(new Uint8Array([60, 115, 99, 114]), 'image/jpeg'),
    false
  );
  assert.equal(
    matchesImageSignature(new Uint8Array([255, 216, 255]), 'image/jpeg'),
    true
  );
  assert.equal(
    matchesImageSignature(
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      'image/png'
    ),
    true
  );
  assert.equal(
    matchesImageSignature(
      new Uint8Array([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]),
      'image/webp'
    ),
    true
  );
});
test('media URLs stay within the event or the curated Ethiopian library', () => {
  const base = 'https://example.supabase.co';
  assert.equal(
    isEventImageUrl(
      base + '/storage/v1/object/public/event-images/event-a/photo.jpg',
      'event-a',
      base
    ),
    true
  );
  assert.equal(
    isEventImageUrl('/images/addis-ababa.jpg', 'event-a', base),
    true
  );
  for (const value of [
    base + '/storage/v1/object/public/event-images/event-b/photo.jpg',
    'https://evil.example/photo.jpg',
    '/images/../../private',
    'javascript:alert(1)',
    base +
      '/storage/v1/object/public/event-images/event-a/../event-b/photo.jpg',
  ])
    assert.equal(isEventImageUrl(value, 'event-a', base), false);
});
test('existing pages retain compatibility and galleries enforce limits', () => {
  const old = { headline: 'An event', accentColor: '#294d3c' };
  const parsed = landingPageConfigSchema.parse(old);
  assert.equal(parsed.coverImage, null);
  assert.deepEqual(parsed.galleryImages, []);
  assert.equal(
    landingPageConfigSchema.safeParse({
      ...old,
      galleryImages: Array(7).fill({
        url: '/images/addis-ababa.jpg',
        alt: 'Addis',
      }),
    }).success,
    false
  );
  assert.equal(
    landingPageConfigSchema.safeParse({
      ...old,
      coverImage: { url: 'javascript:alert(1)' },
    }).success,
    false
  );
  assert.equal(defaultLandingPageConfig('My event').headline, 'My event');
});
test('event accent colors use readable light or dark text', () => {
  assert.equal(accentTextColor('#ffffff'), '#000000');
  assert.equal(accentTextColor('#294d3c'), '#ffffff');
  assert.equal(accentTextColor('#888888'), '#000000');
});
test('Addis Ababa event times round trip without a three-hour shift', () => {
  assert.equal(
    eventDateTimeToIso('2027-01-15T09:00', 'Africa/Addis_Ababa'),
    '2027-01-15T06:00:00.000Z'
  );
  assert.equal(
    localEventDateTime('2027-01-15T06:00:00.000Z', 'Africa/Addis_Ababa'),
    '2027-01-15T09:00'
  );
  assert.equal(
    eventDateTimeToIso('2027-07-15T09:00', 'America/New_York'),
    '2027-07-15T13:00:00.000Z'
  );
  assert.throws(() =>
    eventDateTimeToIso('2027-03-14T02:30', 'America/New_York')
  );
  assert.throws(() => eventDateTimeToIso('not a date', 'Africa/Addis_Ababa'));
  assert.throws(() =>
    eventDateTimeToIso('2027-01-15T09:00', 'invalid/timezone')
  );
});
test('guest pages and submissions share the registration window', () => {
  const now = Date.parse('2026-10-31T12:00:00Z');
  const event = {
    isPublished: true,
    status: 'published',
    registrationOpensAt: null,
    registrationClosesAt: null,
    endsAt: '2027-01-15T15:00:00Z',
  };
  assert.equal(registrationUnavailable(event, now), null);
  assert.match(
    registrationUnavailable({ ...event, isPublished: false }, now),
    /not open/
  );
  assert.match(
    registrationUnavailable(
      { ...event, registrationOpensAt: '2026-11-01T00:00:00Z' },
      now
    ),
    /soon/
  );
  assert.match(
    registrationUnavailable(
      { ...event, registrationClosesAt: '2026-10-01T00:00:00Z' },
      now
    ),
    /closed/
  );
  assert.match(
    registrationUnavailable({ ...event, endsAt: '2026-10-01T00:00:00Z' }, now),
    /ended/
  );
});
