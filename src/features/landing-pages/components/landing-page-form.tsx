'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Eye,
  ImagePlus,
  Loader2,
  Monitor,
  Plus,
  Save,
  Smartphone,
  Trash2,
} from 'lucide-react';
import {
  updateLandingPageAction,
  type LandingPageActionState,
} from '../actions';
import type {
  AgendaItem,
  EventImage,
  LandingPageConfig,
} from '../schemas/landing-page-schemas';
import type { Event } from '@/features/events/services/event-service.interface';
import {
  ETHIOPIAN_IMAGES,
  MAX_GALLERY_IMAGES,
  accentTextColor,
} from '../lib/event-media';
import { EventImagePicker } from './event-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
const emptyItem: AgendaItem = {
  time: '',
  title: '',
  description: '',
  speaker: '',
};
function FieldError({ errors }: { errors?: string[] }) {
  return errors?.length ? (
    <p className="text-xs text-destructive" role="alert">
      {errors[0]}
    </p>
  ) : null;
}
export function LandingPageForm({
  eventId,
  config,
  event,
}: {
  eventId: string;
  config: LandingPageConfig;
  event: Pick<Event, 'title' | 'slug' | 'startsAt' | 'venueName' | 'timezone'>;
}) {
  const [dirty, setDirty] = useState(false);
  const update = updateLandingPageAction.bind(null, eventId);
  const [state, action, pending] = useActionState(
    async (previous: LandingPageActionState, data: FormData) => {
      const result = await update(previous, data);
      if (result.success) setDirty(false);
      return result;
    },
    {}
  );
  const [headline, setHeadline] = useState(config.headline);
  const [subheadline, setSubheadline] = useState(config.subheadline ?? '');
  const [accent, setAccent] = useState(config.accentColor);
  const [cover, setCover] = useState<EventImage | null>(
    config.coverImage ?? null
  );
  const [gallery, setGallery] = useState<EventImage[]>(config.galleryImages);
  const [agenda, setAgenda] = useState<AgendaItem[]>(config.agendaItems ?? []);
  const [busyCount, setBusyCount] = useState(0);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const busy = pending || busyCount > 0;
  function mediaBusy(value: boolean) {
    setBusyCount((count) => Math.max(0, count + (value ? 1 : -1)));
  }
  function editAgenda(index: number, field: keyof AgendaItem, value: string) {
    setAgenda((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    setDirty(true);
  }
  function moveImage(index: number, direction: number) {
    setGallery((items) => {
      const next = [...items];
      [next[index], next[index + direction]] = [
        next[index + direction],
        next[index],
      ];
      return next;
    });
    setDirty(true);
  }
  const previewCover = cover ?? ETHIOPIAN_IMAGES[0];
  return (
    <div className="landing-editor-layout">
      <form
        action={action}
        className="landing-editor-form"
        onChange={() => setDirty(true)}
      >
        <input
          type="hidden"
          name="agendaItems"
          value={JSON.stringify(agenda)}
        />
        <input type="hidden" name="coverImage" value={JSON.stringify(cover)} />
        <input
          type="hidden"
          name="galleryImages"
          value={JSON.stringify(gallery)}
        />
        {state.message && (
          <p
            className={
              'editor-feedback ' + (state.success ? 'is-success' : 'is-error')
            }
            role="status"
          >
            {state.success ? <Check size={17} /> : null}
            {state.message}
          </p>
        )}
        <fieldset disabled={busy} className="editor-section">
          <legend>Set the scene.</legend>
          <p>
            Your headline is the first hello. Give guests a reason to be there.
          </p>
          <div className="space-y-2">
            <Label htmlFor="headline">Event headline</Label>
            <Input
              id="headline"
              name="headline"
              value={headline}
              maxLength={140}
              onChange={(e) => setHeadline(e.target.value)}
              aria-invalid={Boolean(state.errors?.headline)}
            />
            <FieldError errors={state.errors?.headline} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subheadline">A short introduction</Label>
            <Textarea
              id="subheadline"
              name="subheadline"
              value={subheadline}
              maxLength={300}
              onChange={(e) => setSubheadline(e.target.value)}
            />
            <FieldError errors={state.errors?.subheadline} />
            <span className="editor-help">
              {subheadline.length} / 300 characters
            </span>
          </div>
          <div className="editor-brand-fields">
            <div className="space-y-2">
              <Label htmlFor="accentColor">Your event color</Label>
              <div className="editor-color-control">
                <input
                  id="accentColor"
                  name="accentColor"
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                />
                <span>{accent}</span>
              </div>
              <FieldError errors={state.errors?.accentColor} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={config.contactEmail}
                placeholder="events@yourorganization.com"
              />
              <FieldError errors={state.errors?.contactEmail} />
            </div>
          </div>
        </fieldset>
        <section className="editor-section" id="event-images">
          <div className="editor-section-heading">
            <div>
              <h2>A picture of the experience.</h2>
              <p>
                A great cover sets the mood. Add your own photograph or use a
                local Ethiopian image.
              </p>
            </div>
            <ImagePlus size={24} strokeWidth={1.3} />
          </div>
          <h3 className="editor-field-title">Cover image</h3>
          <EventImagePicker
            eventId={eventId}
            value={cover}
            label="Cover image"
            disabled={busy}
            onBusyChange={mediaBusy}
            onChange={(image) => {
              setCover(image);
              setDirty(true);
            }}
          />
          <FieldError errors={state.errors?.coverImage} />
          <div className="gallery-editor-heading">
            <h3>Event gallery</h3>
            <span>
              {gallery.length} / {MAX_GALLERY_IMAGES} photos
            </span>
          </div>
          <p className="editor-help mb-4">
            Add your venue, past gatherings, or details guests can look forward
            to.
          </p>
          <div className="gallery-editor-list">
            {gallery.map((image, index) => (
              <div
                className="gallery-editor-item"
                key={image.url + '-' + index}
              >
                <div className="gallery-editor-thumb">
                  <Image
                    src={image.url}
                    alt={image.alt || 'Gallery image ' + (index + 1)}
                    fill
                    sizes="90px"
                    unoptimized={!image.url.startsWith('/')}
                  />
                </div>
                <label>
                  Photo {index + 1}
                  <Input
                    value={image.alt}
                    maxLength={180}
                    disabled={busy}
                    placeholder="Describe this photograph"
                    onChange={(e) => {
                      setGallery((images) =>
                        images.map((item, i) =>
                          i === index ? { ...item, alt: e.target.value } : item
                        )
                      );
                      setDirty(true);
                    }}
                    aria-label={'Description for gallery photo ' + (index + 1)}
                  />
                </label>
                <div className="gallery-editor-actions">
                  <button
                    type="button"
                    aria-label={'Move photo ' + (index + 1) + ' earlier'}
                    disabled={busy || index === 0}
                    onClick={() => moveImage(index, -1)}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label={'Move photo ' + (index + 1) + ' later'}
                    disabled={busy || index === gallery.length - 1}
                    onClick={() => moveImage(index, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label={'Remove gallery photo ' + (index + 1)}
                    disabled={busy}
                    onClick={() => {
                      setGallery((images) =>
                        images.filter((_, i) => i !== index)
                      );
                      setDirty(true);
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {gallery.length < MAX_GALLERY_IMAGES && (
            <details className="gallery-add-disclosure">
              <summary>
                <Plus size={16} />
                Add a gallery photograph
              </summary>
              <EventImagePicker
                eventId={eventId}
                value={null}
                label="Gallery image"
                disabled={busy}
                onBusyChange={mediaBusy}
                onChange={(image) => {
                  if (image)
                    setGallery((images) =>
                      [...images, image].slice(0, MAX_GALLERY_IMAGES)
                    );
                  setDirty(true);
                }}
              />
            </details>
          )}
          <FieldError errors={state.errors?.galleryImages} />
        </section>
        <fieldset disabled={busy} className="editor-section">
          <legend>Make the day feel considered.</legend>
          <p>
            Add the highlights, practical details, and moments guests should
            make time for.
          </p>
          <div className="space-y-2">
            <Label htmlFor="agenda">Agenda highlights</Label>
            <Textarea
              id="agenda"
              name="agenda"
              defaultValue={config.agenda}
              placeholder="What should guests look forward to?"
            />
            <FieldError errors={state.errors?.agenda} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venueNote">Getting there & venue notes</Label>
            <Textarea
              id="venueNote"
              name="venueNote"
              defaultValue={config.venueNote}
              placeholder="Directions, accessibility, parking, or anything useful to know"
            />
            <FieldError errors={state.errors?.venueNote} />
          </div>
          <div className="gallery-editor-heading">
            <h3>The schedule</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAgenda((items) => [...items, { ...emptyItem }]);
                setDirty(true);
              }}
            >
              <Plus size={15} />
              Add a session
            </Button>
          </div>
          {!agenda.length && (
            <p className="editor-empty">
              A welcome, a conversation, a new idea. Add the moments that make
              your event.
            </p>
          )}
          {agenda.map((item, index) => (
            <div className="agenda-editor-item" key={index}>
              <div className="flex items-center justify-between">
                <strong>Session {index + 1}</strong>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={'Remove session ' + (index + 1)}
                  onClick={() => {
                    setAgenda((items) => items.filter((_, i) => i !== index));
                    setDirty(true);
                  }}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={'session-time-' + index}>Time</Label>
                  <Input
                    id={'session-time-' + index}
                    value={item.time}
                    required
                    placeholder="09:00 AM"
                    onChange={(e) => editAgenda(index, 'time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={'session-speaker-' + index}>
                    Speaker, if any
                  </Label>
                  <Input
                    id={'session-speaker-' + index}
                    value={item.speaker ?? ''}
                    placeholder="Speaker name"
                    onChange={(e) =>
                      editAgenda(index, 'speaker', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={'session-title-' + index}>Session title</Label>
                <Input
                  id={'session-title-' + index}
                  required
                  value={item.title}
                  placeholder="A conversation worth having"
                  onChange={(e) => editAgenda(index, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={'session-description-' + index}>
                  Description, if useful
                </Label>
                <Textarea
                  id={'session-description-' + index}
                  value={item.description ?? ''}
                  onChange={(e) =>
                    editAgenda(index, 'description', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <FieldError errors={state.errors?.agendaItems} />
        </fieldset>
        <div className="editor-save-bar">
          <span role="status">
            {busyCount > 0
              ? 'Uploading your photograph…'
              : pending
                ? 'Saving your page…'
                : dirty
                  ? 'You have unsaved changes.'
                  : 'All changes saved.'}
          </span>
          <Button type="submit" size="lg" disabled={busy}>
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save event page
          </Button>
        </div>
      </form>
      <aside className="editor-preview-panel">
        <div className="editor-preview-toolbar">
          <span>
            <Eye size={15} />A guest’s first impression
          </span>
          <div>
            <button
              type="button"
              aria-label="Desktop preview"
              aria-pressed={device === 'desktop'}
              onClick={() => setDevice('desktop')}
            >
              <Monitor size={16} />
            </button>
            <button
              type="button"
              aria-label="Mobile preview"
              aria-pressed={device === 'mobile'}
              onClick={() => setDevice('mobile')}
            >
              <Smartphone size={16} />
            </button>
          </div>
        </div>
        <div className={'editor-mini-preview ' + device}>
          <div className="editor-mini-hero">
            <Image
              src={previewCover.url}
              alt={previewCover.alt || 'Event cover preview'}
              fill
              sizes="450px"
              unoptimized={!previewCover.url.startsWith('/')}
            />
            <div />
            <h2>{headline || event.title}</h2>
          </div>
          <div className="editor-mini-body">
            <span>
              {new Date(event.startsAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                timeZone: event.timezone,
              })}
            </span>
            <h3>{event.venueName ?? 'Your gathering place'}</h3>
            <p>{subheadline || 'Your event, beautifully introduced.'}</p>
            <span
              className="editor-mini-cta"
              style={{ background: accent, color: accentTextColor(accent) }}
            >
              Reserve your place
              <ArrowUpRight size={16} />
            </span>
            {gallery.length > 0 && (
              <div className="editor-mini-gallery">
                {gallery.slice(0, 3).map((image, i) => (
                  <div key={image.url + i}>
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      sizes="110px"
                      unoptimized={!image.url.startsWith('/')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="editor-preview-footnote">
          The preview follows your edits. Save before opening the full event
          page.
        </p>
        <Link
          href={'/events/' + eventId + '/preview'}
          target="_blank"
          className="text-link"
        >
          Open full draft preview
          <ArrowUpRight size={16} />
        </Link>
      </aside>
    </div>
  );
}
