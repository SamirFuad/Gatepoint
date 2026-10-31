import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCheck, Download, QrCode } from 'lucide-react';
import { Brand } from '@/components/brand';
export function EventPass({
  qrImageUrl,
  confirmation,
  eventTitle,
  eventHref,
  emailFailed = false,
  standalone = false,
}: {
  qrImageUrl?: string | null;
  confirmation?: string;
  eventTitle?: string;
  eventHref?: string;
  emailFailed?: boolean;
  standalone?: boolean;
}) {
  return (
    <div className="event-pass-screen">
      <div className="event-pass-intro">
        <span className="pass-confirmed">
          <CheckCheck size={18} />
          {standalone ? 'Your event pass' : 'Registration complete'}
        </span>
        <h1>You’re part of it.</h1>
        <p>
          {standalone
            ? 'Keep this pass handy. Show your QR code when you arrive.'
            : 'A new connection, a fresh idea, a good reason to be there. We’ll see you at the gathering.'}
        </p>
      </div>
      <section className="guest-event-pass">
        <div className="guest-pass-header">
          <Brand compact />
          <span>
            Good things
            <br />
            happen together.
          </span>
        </div>
        <div className="guest-pass-title">
          <span>Your personal invitation</span>
          <h2>{eventTitle || 'Your next great gathering.'}</h2>
          {confirmation && (
            <p>
              Confirmation <strong>{confirmation}</strong>
            </p>
          )}
        </div>
        <div className="guest-pass-code">
          {qrImageUrl ? (
            <Image
              src={qrImageUrl}
              alt="Your personal event check-in QR code"
              width={260}
              height={260}
              unoptimized
            />
          ) : (
            <div className="guest-pass-pending">
              <QrCode size={55} strokeWidth={1.2} />
              <p>
                Your registration is saved.
                <br />
                Contact the organizer for your QR pass.
              </p>
            </div>
          )}
          <span>
            {qrImageUrl
              ? 'One guest. One unique pass.'
              : 'Keep your confirmation number.'}
          </span>
        </div>
        <div className="guest-pass-actions">
          {qrImageUrl && (
            <a
              href={qrImageUrl}
              download="gatepoint-event-pass.png"
              className="gp-button gp-button-dark"
            >
              <Download size={16} />
              Download your QR pass
            </a>
          )}
          {eventHref && (
            <Link href={eventHref}>
              Back to the event
              <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </section>
      {emailFailed && (
        <p className="guest-pass-notice" role="status">
          Your registration is complete, but the confirmation email could not be
          delivered.{' '}
          {qrImageUrl
            ? 'Download your pass here so you have it for the event.'
            : 'Keep your confirmation number and contact the event organizer.'}
        </p>
      )}
    </div>
  );
}
