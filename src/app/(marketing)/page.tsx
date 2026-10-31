import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCheck,
  Monitor,
  MoveUpRight,
  QrCode,
  ScanLine,
  Users,
} from 'lucide-react';
import { PlatformPreview } from '@/components/marketing/platform-preview';
const services = [
  {
    icon: ScanLine,
    title: 'A seamless arrival.',
    text: 'QR check-in systems, access materials, and on-site technical support to keep your entrance moving.',
    detail: 'Check-in & event-day support',
  },
  {
    icon: BadgeCheck,
    title: 'An identity for every guest.',
    text: 'Thoughtfully designed badges, branded lanyards, and role-based access materials that feel like your event.',
    detail: 'Badging & branded materials',
  },
  {
    icon: Monitor,
    title: 'Keep everyone connected.',
    text: 'Digital signage, schedule displays, and live announcements that help guests find their way.',
    detail: 'Digital signage & displays',
  },
];
const steps = [
  {
    title: 'Make it yours',
    text: 'Create your workspace and event. Set the date, venue, capacity, and the details your guests need to know.',
  },
  {
    title: 'Open the invitation',
    text: 'Publish an event page, share your link, and collect registrations with forms tailored to your gathering.',
  },
  {
    title: 'Bring everyone together',
    text: 'Deliver QR codes, organize your attendee list, and welcome your guests with everything in one place.',
  },
];
const questions = [
  {
    q: 'What kinds of events can I create?',
    a: 'Gatepoint supports conferences, workshops, seminars, corporate events, academic gatherings, and more. Set up the event details and registration experience to suit your audience.',
  },
  {
    q: 'Can my team manage an event together?',
    a: 'Yes. Organization workspaces let your team collaborate on events with role-based access, shared registrations, and a single view of your attendees.',
  },
  {
    q: 'How do guests receive their QR codes?',
    a: 'A unique QR code is generated for each registration. Organizers can manage and deliver codes to attendees by email from the event workspace.',
  },
  {
    q: 'Do you offer on-site event services?',
    a: 'The Gatepoint business includes badge production, branded access materials, digital signage, equipment, and technical event support in Ethiopia. Service scope and pricing are agreed for each event.',
  },
  {
    q: 'How is an event priced?',
    a: 'Registration software and on-site event services can be scoped to your event requirements. Create an account to begin planning; service packages and any associated fees are agreed separately.',
  },
];
export default function HomePage() {
  return (
    <div id="top" className="marketing-home">
      <section className="hero site-container">
        <div className="hero-copy">
          <h1>
            Great events.
            <br />
            Effortless entry.
            <br />
            <span>Real connection.</span>
          </h1>
          <p>
            From the first invitation to the final check-in. Bring your
            registration, guests, and event experience together with Gatepoint.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="gp-button gp-button-dark">
              Create your event <ArrowUpRight size={18} />
            </Link>
            <Link href="#features" className="hero-secondary">
              Meet your platform <ArrowDown size={16} />
            </Link>
          </div>
          <div className="hero-note">
            <Check size={15} /> Your event. Your brand. One connected
            experience.
          </div>
          <div className="hero-location">
            <span className="hero-location-line" />
            Made for gatherings. Built in Ethiopia.
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/images/addis-conference.jpg"
            alt="Delegates in the United Nations conference hall in Addis Ababa, Ethiopia"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 50vw"
            className="hero-photo"
          />
          <div className="hero-image-shade" />
          <span className="photo-caption">Make room for what matters.</span>
          <div className="hero-pass">
            <div className="pass-top">
              <span className="pass-icon">
                <QrCode size={18} />
              </span>
              <span>
                The good kind of
                <br />
                <strong>all-access.</strong>
              </span>
              <ArrowUpRight size={18} />
            </div>
            <div className="pass-rule" />
            <div className="pass-body">
              <span>
                Less waiting.
                <br />
                More belonging.
              </span>
              <QrCode size={54} strokeWidth={1.4} />
            </div>
            <div className="pass-bottom">
              <CheckCheck size={15} />
              <span>Every guest, connected.</span>
            </div>
          </div>
          <div className="hero-image-index">
            <span>People first.</span>
            <span>Always.</span>
          </div>
        </div>
      </section>
      <section className="audience-band">
        <div className="site-container audience-inner">
          <p>
            For the people
            <br />
            <strong>who bring people together.</strong>
          </p>
          <div>
            <span>Conferences & forums</span>
            <span>Corporate gatherings</span>
            <span>NGOs & institutions</span>
            <span>Workshops & communities</span>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="platform-section site-container section-space"
      >
        <div className="section-intro">
          <h2>
            Behind every great event,
            <br />
            <span>a little less busywork.</span>
          </h2>
          <p>
            A considered set of tools for everything that happens before the
            doors open. More clarity for your team. A better welcome for your
            guests.
          </p>
        </div>
        <PlatformPreview />
        <div className="platform-benefits">
          <span>
            <CalendarDays size={17} /> Beautiful event pages
          </span>
          <span>
            <Users size={17} /> Shared team workspaces
          </span>
          <span>
            <QrCode size={17} /> Personal QR codes
          </span>
          <span>
            <CheckCheck size={17} /> One organized guest list
          </span>
        </div>
      </section>
      <section id="services" className="services-section">
        <div className="site-container section-space">
          <div className="services-intro">
            <div>
              <h2>
                Beyond the screen.
                <br />
                <span>Into the experience.</span>
              </h2>
              <p>
                Technology is only part of a great event. Our on-site services
                bring the details together, from the badge around your neck to
                the welcome at the door.
              </p>
            </div>
            <div className="services-photo">
              <Image
                src="/images/addis-ababa.jpg"
                alt="Aerial view of Addis Ababa, Ethiopia"
                fill
                sizes="(max-width: 800px) 100vw, 35vw"
              />
            </div>
          </div>
          <div className="services-list">
            {services.map((service) => (
              <article key={service.title}>
                <service.icon size={28} strokeWidth={1.3} />
                <span>{service.detail}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
          <div className="service-disclosure">
            <span>
              On-site services are arranged separately for your event.
            </span>
            <Link href="/register">
              Start with your event <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section
        id="how-it-works"
        className="workflow-section site-container section-space"
      >
        <div className="workflow-heading">
          <h2>
            From “what if”
            <br />
            to <span>“welcome in.”</span>
          </h2>
          <p>Big ideas deserve a simple beginning.</p>
          <Link href="/register" className="text-link">
            Let’s make it happen <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="workflow-steps">
          {steps.map((step, i) => (
            <article key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              <ArrowRight size={20} />
            </article>
          ))}
        </div>
      </section>
      <section id="questions" className="questions-section site-container">
        <div>
          <h2>
            A few things
            <br />
            you might be wondering.
          </h2>
          <p>Good questions. Clear answers.</p>
        </div>
        <div className="faq-list">
          {questions.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="cta-section site-container">
        <div className="cta-inner">
          <div>
            <h2>
              Something great
              <br />
              starts at the gate.
            </h2>
            <p>Your next gathering is waiting to happen.</p>
            <Link href="/register" className="gp-button gp-button-dark">
              Create your event <ArrowUpRight size={18} />
            </Link>
          </div>
          <MoveUpRight
            className="cta-arrow"
            strokeWidth={0.8}
            aria-hidden="true"
          />
        </div>
      </section>
    </div>
  );
}
