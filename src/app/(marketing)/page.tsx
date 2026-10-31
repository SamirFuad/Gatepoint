// =============================================================
// Gatepoint — Marketing Landing Page (v2)
// Redesigned with Electric Cobalt design system
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
  Building2,
  Zap,
  Mail,
  ScanLine,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ---- Feature Data ----
const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Event Management',
    description:
      'Create conferences, workshops, and seminars with a streamlined dashboard built for speed.',
  },
  {
    icon: Globe,
    title: 'Landing Pages',
    description:
      'Auto-generated, SEO-optimized event pages that look professional and convert registrations.',
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description:
      'Track registrations, manage waitlists, and handle capacity limits in real time.',
  },
  {
    icon: QrCode,
    title: 'QR Code Delivery',
    description:
      'Unique QR codes generated and emailed automatically to every registered attendee.',
  },
  {
    icon: LayoutDashboard,
    title: 'Organizer Dashboard',
    description:
      'Real-time overview of events, registrations, and team activity — all in one place.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Role-based access, data isolation, and security best practices built into every layer.',
  },
];

// ---- How It Works ----
const STEPS = [
  {
    step: '01',
    title: 'Create Your Organization',
    description: 'Set up your workspace in seconds. Invite your team and assign roles.',
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
    description: 'Go live with one click. Share your event page and collect registrations.',
  },
  {
    step: '04',
    title: 'Manage & Deliver',
    description: 'Track attendees, send QR codes, and manage check-in effortlessly.',
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
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative overflow-hidden hero-bg">
        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-60" />

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
              <Zap className="size-3.5" />
              Now in Public Beta
            </div>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Event Registration{' '}
              <span className="text-gradient">Made Simple</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The all-in-one platform for creating events, managing registrations,
              and delivering QR codes. Built for organizations that need reliability.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 gap-2 px-10 text-base font-semibold glow-cobalt'
                )}
              >
                Start For Free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#features"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-12 px-10 text-base font-semibold'
                )}
              >
                See Features
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              {[
                'No credit card required',
                'Free forever plan',
                'Setup in 2 minutes',
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          STATS STRIP
          ================================================================ */}
      <section className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'text-center',
                  index < STATS.length - 1 && 'md:border-r md:border-border/50'
                )}
              >
                <div className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES
          ================================================================ */}
      <section id="features" className="scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to run{' '}
              <span className="text-gradient">successful events</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              From creation to check-in, Gatepoint handles every step of your
              event lifecycle with precision and care.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="feature-card p-8 transition-transform duration-200 hover:scale-[1.02]"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-accent">
                  <feature.icon className="size-6 text-primary" />
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

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section id="how-it-works" className="scroll-mt-20 border-y bg-muted/40 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From setup to success{' '}
              <span className="text-gradient">in four steps</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Getting started with Gatepoint is fast. No technical expertise required.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 lg:block">
                    <div className="h-full w-full border-t-2 border-dashed border-primary/20" />
                  </div>
                )}
                <div className="rounded-xl border bg-card p-8">
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-lg font-bold text-primary">
                    {step.step}
                  </span>
                  <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          WHO IT'S FOR
          ================================================================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Built For
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by organizations{' '}
              <span className="text-gradient">of all sizes</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <div key={org.title} className="rounded-xl border bg-card p-8">
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-accent">
                  <org.icon className="size-6 text-primary" />
                </div>
                <h3 className="mb-4 text-base font-semibold">{org.title}</h3>
                <ul className="space-y-3">
                  {org.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW THE FLOW WORKS (product illustration)
          ================================================================ */}
      <section className="border-y bg-muted/40 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: CalendarCheck,
                title: 'Publish your event',
                description: 'Fill in the details and go live in minutes.',
              },
              {
                icon: Mail,
                title: 'Collect registrations',
                description: 'Attendees sign up on your custom event page.',
              },
              {
                icon: ScanLine,
                title: 'Scan & check in',
                description: 'Use QR codes for fast, frictionless check-in on the day.',
              },
            ].map((item, i) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA
          ================================================================ */}
      <section id="pricing" className="scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-20 text-center sm:px-16 sm:py-24">
            {/* Subtle radial glows */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">
                Get Started
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                Ready to streamline your events?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-primary-foreground/75">
                Join organizations already using Gatepoint to create
                unforgettable event experiences. Start free, upgrade anytime.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-12 gap-2 bg-white px-10 text-base font-semibold text-primary shadow-lg hover:bg-white/90'
                  )}
                >
                  Get Started For Free
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <p className="mt-5 text-xs text-primary-foreground/50">
                No credit card required &middot; Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
