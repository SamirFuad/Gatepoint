'use client';
import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';
import { Check, ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { uploadEventImageAction } from '../actions';
import { ETHIOPIAN_IMAGES, validateImageFile } from '../lib/event-media';
import type { EventImage } from '../schemas/landing-page-schemas';

export function EventImagePicker({
  eventId,
  value,
  onChange,
  label,
  disabled = false,
  onBusyChange,
}: {
  eventId: string;
  value: EventImage | null;
  onChange: (image: EventImage | null) => void;
  label: string;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [uploading, startUpload] = useTransition();
  const [dragging, setDragging] = useState(false);
  function upload(file?: File) {
    if (!file || uploading || disabled) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError('');
    onBusyChange?.(true);
    startUpload(async () => {
      const data = new FormData();
      data.set('image', file);
      try {
        const result = await uploadEventImageAction(eventId, data);
        if (result.image) onChange(result.image);
        else setError(result.error ?? 'The upload didn’t finish. Try again.');
      } catch {
        setError(
          'We couldn’t upload this image. Check your connection and try again.'
        );
      }
      if (input.current) input.current.value = '';
      onBusyChange?.(false);
    });
  }
  return (
    <div className="image-picker">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-label={label + ' file'}
        disabled={uploading || disabled}
        onChange={(event) => upload(event.target.files?.[0])}
      />
      {value ? (
        <div className="image-picker-selected">
          <Image
            src={value.url}
            alt={value.alt || label}
            fill
            sizes="(max-width:650px) 100vw, 50vw"
            unoptimized={!value.url.startsWith('/')}
          />
          <div className="image-picker-controls">
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={uploading || disabled}
            >
              <Upload size={14} />
              {uploading ? 'Uploading…' : 'Replace image'}
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={uploading || disabled}
              aria-label={'Remove ' + label.toLowerCase()}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={'image-upload-zone' + (dragging ? ' is-dragging' : '')}
          disabled={uploading || disabled}
          onClick={() => input.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            upload(event.dataTransfer.files[0]);
          }}
        >
          {uploading ? (
            <Loader2 size={25} className="animate-spin" />
          ) : (
            <ImagePlus size={26} strokeWidth={1.3} />
          )}
          <strong>
            {uploading
              ? 'Bringing your image in…'
              : 'Drop an image here, or browse'}
          </strong>
          <span>JPG, PNG, or WebP. Up to 5 MB.</span>
        </button>
      )}
      {error && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      {value && (
        <label className="image-alt-label">
          Image description
          <input
            type="text"
            value={value.alt}
            maxLength={180}
            disabled={disabled}
            placeholder="Describe this image for guests using screen readers"
            onChange={(event) =>
              onChange({ ...value, alt: event.target.value })
            }
          />
        </label>
      )}
      <div className="image-library">
        <span>Or choose a local Ethiopian image</span>
        <div>
          {ETHIOPIAN_IMAGES.map((image) => (
            <button
              type="button"
              key={image.url}
              aria-label={'Use ' + image.label}
              aria-pressed={image.url === value?.url}
              disabled={uploading || disabled}
              onClick={() => {
                onChange({ url: image.url, alt: image.alt });
                setError('');
              }}
            >
              <Image src={image.url} alt="" fill sizes="140px" />
              <span>{image.label}</span>
              {image.url === value?.url && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
