import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export const metadata = { title: 'Ethiopian Photography' };
export default function PhotoCredits() {
  return (
    <article className="site-container py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-medium">Rooted in Ethiopia.</h1>
        <p className="mt-6 max-w-xl text-sm leading-8 text-muted-foreground">
          The photographs used in our site and local image library show places
          and gatherings in Ethiopia. These contextual photographs are separate
          from photographs uploaded by event organizers.
        </p>
        <div className="mt-10 space-y-8">
          <section className="border-t pt-6">
            <h2 className="text-2xl font-medium">A gathering in Addis Ababa</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              United Nations Plenary Hall, Addis Ababa, during the African Union
              Summit on 2 February 2009. Photograph by Jesse B. Awalt, U.S.
              Navy. Public domain. Presented with responsive cropping.
            </p>
            <a
              className="text-link mt-3"
              href="https://commons.wikimedia.org/wiki/File:Plenary_Hall,_12th_AU_Summit,_090202-N-0506A-291.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              View photograph and source
              <ArrowUpRight size={16} />
            </a>
          </section>
          <section className="border-t pt-6">
            <h2 className="text-2xl font-medium">A view of the city</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              CMC Yetebaberut square, Addis Ababa, photographed on 12 August
              2024. Source: PMO Ethiopia, via Wikimedia Commons, listed as
              public domain. Presented with responsive cropping.
            </p>
            <a
              className="text-link mt-3"
              href="https://commons.wikimedia.org/wiki/File:Addis_Ababa_sky_view.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              View photograph and source
              <ArrowUpRight size={16} />
            </a>
          </section>
        </div>
        <Link href="/" className="gp-button gp-button-dark mt-12">
          Back to Gatepoint
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
