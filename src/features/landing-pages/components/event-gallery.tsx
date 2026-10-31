'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { EventImage } from '../schemas/landing-page-schemas';
export function EventGallery({ images }: { images: EventImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <>
      <div className="event-photo-gallery">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.url + '-' + index}
            onClick={() => setActive(index)}
            aria-label={'View ' + (image.alt || 'event photo ' + (index + 1))}
          >
            <Image
              src={image.url}
              alt={image.alt || 'Event photo ' + (index + 1)}
              fill
              sizes="(max-width:650px) 100vw, 40vw"
              unoptimized={!image.url.startsWith('/')}
            />
            <span>
              <Expand size={18} />
            </span>
          </button>
        ))}
      </div>
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          className="event-lightbox"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight')
              setActive(((active ?? 0) + 1) % images.length);
            if (event.key === 'ArrowLeft')
              setActive(((active ?? 0) - 1 + images.length) % images.length);
          }}
        >
          <DialogTitle className="sr-only">Event photographs</DialogTitle>
          <DialogDescription className="sr-only">
            Browse photographs with the arrow keys. Press Escape to close.
          </DialogDescription>
          {active !== null && (
            <>
              <div className="event-lightbox-image">
                <Image
                  src={images[active].url}
                  alt={images[active].alt || 'Event photo ' + (active + 1)}
                  fill
                  sizes="90vw"
                  unoptimized
                />
              </div>
              <div className="event-lightbox-footer">
                <button
                  type="button"
                  onClick={() =>
                    setActive((active - 1 + images.length) % images.length)
                  }
                  aria-label="Previous photograph"
                >
                  <ArrowLeft size={20} />
                </button>
                <p>
                  {images[active].alt || 'Event photograph'}
                  <span>
                    {active + 1} / {images.length}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setActive((active + 1) % images.length)}
                  aria-label="Next photograph"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
