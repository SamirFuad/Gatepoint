'use client';
import Link from 'next/link';
import { useAuthUser } from '@/components/providers/auth-provider';
import { ArrowUpRight } from 'lucide-react';
import { Brand } from '@/components/brand';
export function MarketingFooter() {
  const user = useAuthUser();
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label="Gatepoint home">
              <Brand />
            </Link>
            <p>
              Good technology.
              <br />
              Extraordinary gatherings.
            </p>
          </div>
          <div>
            <h3>Make it happen</h3>
            <Link href={user ? '/events/new' : '/register'}>
              Create an event <ArrowUpRight size={14} />
            </Link>
            <Link href={user ? '/dashboard' : '/login'}>
              {user ? 'My workspace' : 'Organizer sign in'}
            </Link>
            <Link href="/public/events">Explore events</Link>
          </div>
          <div>
            <h3>Discover Gatepoint</h3>
            <Link href="/#features">The platform</Link>
            <Link href="/#services">On-site services</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#questions">Common questions</Link>
          </div>
          <div className="footer-location">
            <ArrowUpRight className="location-mark" aria-hidden="true" />
            <p>
              Rooted in Addis Ababa.
              <br />
              Built for connection.
            </p>
            <span>Ethiopia</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Gatepoint Digital Solutions</span>
          <Link href="/photo-credits">Ethiopian photography</Link>
          <Link href="#top">Back to top ↑</Link>
        </div>
      </div>
    </footer>
  );
}
