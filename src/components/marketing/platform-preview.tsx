'use client';
import { CreateEventLink } from '@/components/events/create-event-link';

import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  ClipboardList,
  Mail,
  QrCode,
  Users,
} from 'lucide-react';

const views = [
  {
    title: 'Registration, without the friction.',
    label: 'Registration',
    icon: ClipboardList,
    description:
      'Give your event a beautiful home. Collect the details you need with a custom registration form, all in one place.',
  },
  {
    title: 'A warm welcome starts here.',
    label: 'QR delivery',
    icon: QrCode,
    description:
      'Every registration gets a unique QR code. Send confirmations straight to your guests and keep entry organized.',
  },
  {
    title: 'Every guest. One clear picture.',
    label: 'Attendee management',
    icon: Users,
    description:
      'See who has registered, manage capacity, and keep your team connected to the same attendee information.',
  },
];

export function PlatformPreview() {
  const [active, setActive] = useState(0);
  const view = views[active];
  return (
    <div className="platform-feature">
      <div className="platform-copy">
        <div
          className="feature-tabs"
          role="tablist"
          aria-label="Platform capabilities"
        >
          {views.map((item, i) => (
            <button
              type="button"
              id={`feature-tab-${i}`}
              key={item.label}
              role="tab"
              aria-selected={active === i}
              aria-controls={`feature-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (
                  ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)
                ) {
                  e.preventDefault();
                  const next =
                    e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? views.length - 1
                        : (i +
                            (e.key === 'ArrowRight' ? 1 : -1) +
                            views.length) %
                          views.length;
                  setActive(next);
                  document.getElementById(`feature-tab-${next}`)?.focus();
                }
              }}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`feature-panel-${active}`}
          aria-labelledby={`feature-tab-${active}`}
          tabIndex={0}
          className="feature-panel"
        >
          <h3>{view.title}</h3>
          <p>{view.description}</p>
          <CreateEventLink className="text-link">
            Build your first event <ArrowUpRight size={18} />
          </CreateEventLink>
        </div>
      </div>
      <div
        className="product-sample"
        aria-label={`${view.label} illustrative preview`}
      >
        <div className="sample-top">
          <span>Inside Gatepoint</span>
          <span className="sample-label">Illustrative preview</span>
        </div>
        {active === 0 && (
          <div className="sample-registration">
            <div className="sample-event-art">
              <span>
                Ideas meet
                <br />
                possibility.
              </span>
              <span>Community gathering</span>
            </div>
            <div className="sample-form">
              <h4>You’re on the guest list.</h4>
              <p>A simple beginning to a great experience.</p>
              <div className="sample-field">
                <span>Full name</span>
                <span>Your name</span>
              </div>
              <div className="sample-field">
                <span>Email address</span>
                <span>you@example.com</span>
              </div>
              <CreateEventLink className="gp-button gp-button-dark">
                Create your own registration <ArrowUpRight size={16} />
              </CreateEventLink>
            </div>
          </div>
        )}
        {active === 1 && (
          <div className="sample-delivery">
            <div className="mail-icon">
              <Mail size={26} />
            </div>
            <span className="sample-label">Registration confirmed</span>
            <h4>
              Your next great
              <br />
              experience awaits.
            </h4>
            <p>A personal QR code, delivered to your inbox.</p>
            <div className="sample-qr">
              <QrCode size={90} strokeWidth={1.2} />
              <span>Your event pass</span>
              <CheckCheck size={24} />
            </div>
            <span className="sample-footnote">
              One registration. One unique code.
            </span>
          </div>
        )}
        {active === 2 && (
          <div className="sample-attendees">
            <h4>
              A little less admin.
              <br />A lot more connection.
            </h4>
            <p>A shared view of your guest list.</p>
            {[
              'Confirmed registrations',
              'Capacity and availability',
              'QR code delivery',
              'Team access',
            ].map((item) => (
              <div className="sample-list-row" key={item}>
                <span className="sample-check">
                  <Check size={16} />
                </span>
                <span>{item}</span>
                <span>Organized</span>
              </div>
            ))}
            <CreateEventLink className="text-link">
              Bring your event together <ArrowUpRight size={16} />
            </CreateEventLink>
          </div>
        )}
      </div>
    </div>
  );
}
