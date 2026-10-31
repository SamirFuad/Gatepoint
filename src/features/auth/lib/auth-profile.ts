import type { AuthUser } from '../services/auth-service.interface';

export function authProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  email_confirmed_at?: string | null;
}): AuthUser {
  const name = [user.user_metadata?.full_name, user.user_metadata?.name].find(
    (value) => typeof value === 'string' && value.trim()
  );
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: typeof name === 'string' ? name.trim() : null,
    avatarUrl:
      typeof user.user_metadata?.avatar_url === 'string'
        ? user.user_metadata.avatar_url
        : null,
    emailVerified: Boolean(user.email_confirmed_at),
  };
}

export function profileName(user: AuthUser) {
  return user.fullName?.trim() || user.email.split('@')[0] || 'Your account';
}

export function profileInitials(user: AuthUser) {
  return profileName(user)
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
