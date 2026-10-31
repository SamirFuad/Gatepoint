export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 6;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ETHIOPIAN_IMAGES = [
  {
    url: '/images/addis-conference.jpg',
    alt: 'Delegates gathered in the United Nations conference hall in Addis Ababa, Ethiopia',
    label: 'A gathering in Addis',
  },
  {
    url: '/images/addis-ababa.jpg',
    alt: 'Aerial view of CMC Yetebaberut square in Addis Ababa, Ethiopia',
    label: 'Made in Addis Ababa',
  },
] as const;

export function validateImageFile(file: { size: number; type: string }) {
  if (!file.size) return 'Choose an image to upload.';
  if (file.size > MAX_IMAGE_BYTES) return 'Choose an image smaller than 5 MB.';
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type))
    return 'Use a JPG, PNG, or WebP image.';
  return null;
}

export function matchesImageSignature(bytes: Uint8Array, type: string) {
  if (type === 'image/jpeg')
    return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === 'image/png')
    return [137, 80, 78, 71, 13, 10, 26, 10].every(
      (value, index) => bytes[index] === value
    );
  if (type === 'image/webp')
    return (
      [82, 73, 70, 70].every((value, index) => bytes[index] === value) &&
      [87, 69, 66, 80].every((value, index) => bytes[index + 8] === value)
    );
  return false;
}

export function isEventImageUrl(
  url: string,
  eventId: string,
  supabaseUrl: string
) {
  if (ETHIOPIAN_IMAGES.some((image) => image.url === url)) return true;
  try {
    const image = new URL(url);
    const base = new URL(supabaseUrl);
    return (
      image.origin === base.origin &&
      image.pathname.startsWith(
        '/storage/v1/object/public/event-images/' + eventId + '/'
      ) &&
      !image.search &&
      !image.hash
    );
  } catch {
    return false;
  }
}

export function accentTextColor(hex: string) {
  if (!/^#[\da-f]{6}$/i.test(hex)) return '#ffffff';
  const rgb = hex
    .slice(1)
    .match(/../g)!
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    );
  const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  return luminance > 0.179 ? '#000000' : '#ffffff';
}
