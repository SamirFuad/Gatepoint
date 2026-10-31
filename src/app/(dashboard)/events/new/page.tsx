import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Globe,
  Send,
} from 'lucide-react';
import { CreateEventForm } from '@/features/events/components/event-forms';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Create an Event' };
export default function NewEventPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link href="/events" className="event-back">
        <ArrowLeft size={14} />
        Your events
      </Link>
      <div className="dashboard-greeting mb-9">
        <div>
          <h1>Every gathering starts with an idea.</h1>
          <p>
            Tell us about yours. You can fine-tune the details before
            publishing.
          </p>
        </div>
      </div>
      <div className="event-create-layout">
        <CreateEventForm />
        <aside className="event-create-guide">
          <CalendarDays size={28} strokeWidth={1.2} />
          <h2>
            A little planning.
            <br />A great beginning.
          </h2>
          <p>
            Start with the essentials. Bring the rest together when you’re
            ready.
          </p>
          <ol>
            <li>
              <Check size={15} />
              <span>
                <strong>Set the scene</strong>Add your event details, date, and
                venue.
              </span>
            </li>
            <li>
              <Globe size={15} />
              <span>
                <strong>Make it yours</strong>Customize your event page and
                registration form.
              </span>
            </li>
            <li>
              <Send size={15} />
              <span>
                <strong>Open the invitation</strong>Publish and share your event
                with your people.
              </span>
            </li>
          </ol>
          <Link href="/public/events" className="text-link">
            Explore other gatherings
            <ArrowUpRight size={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
