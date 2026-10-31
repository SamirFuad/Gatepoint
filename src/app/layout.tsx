import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider, ToastProvider } from '@/components/providers';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { createClient } from '@/lib/supabase/server';
import { authProfile } from '@/features/auth/lib/auth-profile';

export const metadata: Metadata = {
  title: {
    default: 'Gatepoint — Great Events. Real Connection.',
    template: '%s | Gatepoint',
  },
  description:
    'Bring registration, guests, and your event experience together. Event registration, QR passes, badging, and on-site event technology in Ethiopia.',
  keywords: [
    'event registration',
    'event management',
    'conference registration',
    'QR check-in',
    'attendee management',
  ],
  icons: { icon: '/icon.svg', shortcut: '/icon.svg' },
  authors: [{ name: 'Gatepoint' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Gatepoint',
    title: 'Gatepoint — Great Events. Real Connection.',
    description:
      'Cloud-based event registration platform for conferences, workshops, and corporate events.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider
          key={user?.id ?? 'anonymous'}
          initialUser={user ? authProfile(user) : null}
        >
          <QueryProvider>
            <TooltipProvider>
              {children}
              <ToastProvider />
            </TooltipProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
