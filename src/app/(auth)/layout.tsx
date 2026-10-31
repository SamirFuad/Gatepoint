import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Brand } from '@/components/brand';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <Link href="/" aria-label="Gatepoint home">
          <Brand />
        </Link>
        <div className="auth-story-copy">
          <h1>
            A great gathering
            <br />
            starts with
            <br />
            <span>a simple hello.</span>
          </h1>
          <p>
            One place for your events, your guests, and every detail that brings
            them together.
          </p>
        </div>
        <div className="auth-story-image">
          <Image
            src="/images/addis-conference.jpg"
            alt="A gathering at the United Nations conference hall in Addis Ababa"
            fill
            sizes="50vw"
            priority
          />
        </div>
        <div className="auth-story-footer">
          <span>Gatepoint Digital Solutions</span>
          <span>Addis Ababa, Ethiopia</span>
        </div>
      </aside>
      <main className="auth-content">
        <Link href="/" className="auth-back">
          <ArrowLeft size={15} />
          Back to home
        </Link>
        <div className="auth-form-wrap">{children}</div>
        <p className="auth-privacy">
          Thoughtfully built for the people who bring people together.
        </p>
      </main>
    </div>
  );
}
