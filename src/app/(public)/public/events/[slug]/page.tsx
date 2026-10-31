import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createLandingPageService } from '@/features/landing-pages/services/supabase-landing-page-service';
import {
  defaultLandingPageConfig,
  landingPageConfigSchema,
} from '@/features/landing-pages/schemas/landing-page-schemas';
import { EventExperience } from '@/features/landing-pages/components/event-experience';
import { createClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
type PageProps = { params: Promise<{ slug: string }> };
async function getPublishedEvent(slug: string) {
  const result = await createLandingPageService().getPublishedEventBySlug(slug);
  return result.error ? null : result.data;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);
  if (!event) return { title: 'Event not found' };
  const config =
    landingPageConfigSchema.safeParse(event.landingPageConfig).data ??
    defaultLandingPageConfig(event.title);
  return {
    title: config.headline,
    description: config.subheadline || event.description || undefined,
    openGraph: {
      title: config.headline,
      description: config.subheadline || event.description || undefined,
      type: 'website',
      ...(config.coverImage?.url.startsWith('https://')
        ? {
            images: [
              { url: config.coverImage.url, alt: config.coverImage.alt },
            ],
          }
        : {}),
    },
  };
}
export default async function PublicEventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);
  if (!event) notFound();
  const config =
    landingPageConfigSchema.safeParse(event.landingPageConfig).data ??
    defaultLandingPageConfig(event.title);
  const supabase = await createClient();
  const { data: host } = await supabase
    .from('organizations')
    .select('name,description,logo_url,website')
    .eq('id', event.organizationId)
    .single();
  return (
    <main>
      <EventExperience
        event={event}
        config={config}
        host={
          host
            ? {
                name: host.name,
                description: host.description,
                logoUrl: host.logo_url,
                website: host.website,
              }
            : null
        }
      />
    </main>
  );
}
