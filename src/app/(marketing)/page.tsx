// =============================================================
// Gatepoint — Marketing Landing Page
// =============================================================
// Premium SaaS landing page with:
// - Hero section with animated gradient
// - Feature grid with icons
// - How it works steps
// - Stats/social proof
// - CTA section
// =============================================================

import Link from 'next/link';
import {
  CalendarCheck,
  QrCode,
  Users,
  LayoutDashboard,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  Building2,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ---- Feature Data ----
const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Event Management',
    description:
      'Create and manage conferences, workshops, seminars, and more with an intuitive dashboard.',
  },
  {
    icon: Globe,
    title: 'Beautiful Landing Pages',
    description:
      'Auto-generated, SEO-optimized event pages that look professional and drive registrations.',
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description:
      'Track registrations, manage attendees, and handle capacity limits in real-time.',
  },
  {
    icon: QrCode,
    title: 'QR Code Delivery',
    description:
      'Unique QR codes generated and delivered automatically to every registered attendee.',
  },
  {
    icon: LayoutDashboard,
    title: 'Organizer Dashboard',
    description:
      'Real-time overview of your events, registrations, and team activity at a glance.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Role-based access control, data isolation, and security best practices built in.',
  },
];

// ---- How It Works Steps ----
const STEPS = [
  {
    step: '01',
    title: 'Create Your Organization',
    description:
      'Set up your organization in seconds. Invite your team and assign roles.',
  },
  {
    step: '02',
    title: 'Build Your Event',
    description:
      'Create events with custom registration forms, landing pages, and capacity settings.',
  },
  {
    step: '03',
    title: 'Publish & Share',
    description:
      'Go live with one click. Share your event page and start collecting registrations.',
  },
  {
    step: '04',
    title: 'Manage & Deliver',
    description:
      'Track attendees, send QR codes via email, and manage your event effortlessly.',
  },
];

// ---- Stats ----
const STATS = [
  { value: 'Unlimited', label: 'Events' },
  { value: 'Instant', label: 'QR Delivery' },
  { value: '99.9%', label: 'Uptime' },
  { value: 'Free', label: 'To Start' },
];

export default function HomePage() {
  return (
    <>
      {/* ---- Hero Section ---- */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-hero bg-grid" />
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium"
            >
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              Now in Public Beta
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Event Registration{' '}
              <span className="text-gradient">Made Simple</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The all-in-one platform for creating events, managing
              registrations, and delivering QR codes. Built for organizations
              that demand reliability and simplicity.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'gap-2 px-8 text-base'
                )}
              >
                Start For Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'px-8 text-base'
                )}
              >
                See Features
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {[
                'No credit card required',
                'Free forever plan',
                'Setup in 2 minutes',
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stats Section ---- */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section id="features" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to run{' '}
              <span className="text-gradient">successful events</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From creation to check-in, Gatepoint handles every step of your
              event lifecycle with precision and elegance.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works Section ---- */}
      <section id="how-it-works" className="scroll-mt-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From setup to success in{' '}
              <span className="text-gradient">four steps</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Getting started with Gatepoint is fast and straightforward. No
              technical expertise required.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-border lg:block" />
                )}
                <div className="relative rounded-2xl border bg-card p-8">
                  <span className="mb-4 inline-block text-3xl font-bold text-primary/20">
                    {step.step}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Who It's For Section ---- */}
      <section className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Built For
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by organizations{' '}
              <span className="text-gradient">of all sizes</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: 'Corporations',
                items: [
                  'Annual conferences',
                  'Employee training workshops',
                  'Corporate retreats',
                ],
              },
              {
                icon: Users,
                title: 'Universities & NGOs',
                items: [
                  'Academic seminars',
                  'Research symposiums',
                  'Community events',
                ],
              },
              {
                icon: Globe,
                title: 'Government & Public',
                items: [
                  'Public consultations',
                  'Official ceremonies',
                  'Civic engagement events',
                ],
              },
            ].map((org) => (
              <div
                key={org.title}
                className="rounded-2xl border bg-card p-8"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <org.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">{org.title}</h3>
                <ul className="space-y-2">
                  {org.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section id="pricing" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:px-16 sm:py-20">
            {/* Background decorations */}
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to streamline your events?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
                Join organizations already using Gatepoint to create
                unforgettable event experiences. Start free, upgrade anytime.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'gap-2 bg-white px-8 text-base text-primary hover:bg-white/90'
                  )}
                >
                  Get Started For Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-primary-foreground/60">
                No credit card required &middot; Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
