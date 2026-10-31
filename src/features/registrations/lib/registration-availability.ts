type RegistrationWindow = {
  isPublished: boolean;
  status: string;
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  endsAt: string;
};
export function registrationUnavailable(
  event: RegistrationWindow,
  now = Date.now()
): string | null {
  if (!event.isPublished || event.status !== 'published')
    return 'Registration is not open for this event.';
  if (new Date(event.endsAt).getTime() < now) return 'This event has ended.';
  if (
    event.registrationOpensAt &&
    new Date(event.registrationOpensAt).getTime() > now
  )
    return 'Registration opens soon.';
  if (
    event.registrationClosesAt &&
    new Date(event.registrationClosesAt).getTime() < now
  )
    return 'Registration has closed.';
  return null;
}
