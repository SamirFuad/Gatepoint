import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider, ToastProvider } from '@/components/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Gatepoint — Event Registration Platform',
    template: '%s | Gatepoint',
  },
  description:
    'Cloud-based event registration platform for conferences, workshops, and corporate events. Create events, manage registrations, and deliver QR codes.',
  keywords: [
    'event registration',
    'event management',
    'conference registration',
    'QR check-in',
    'attendee management',
  ],
  authors: [{ name: 'Gatepoint' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Gatepoint',
    title: 'Gatepoint — Event Registration Platform',
    description:
      'Cloud-based event registration platform for conferences, workshops, and corporate events.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>
            {children}
            <ToastProvider />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
