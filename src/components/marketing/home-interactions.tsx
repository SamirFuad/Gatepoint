'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  CheckCheck,
  QrCode,
  RotateCcw,
  ScanLine,
  Pause,
  Play,
} from 'lucide-react';

/** Replay entrances on re-entry; a wider reset boundary prevents edge flicker. */
export function HomeInteractions({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = root.current?.querySelectorAll<HTMLElement>(
      '.hero-copy, .hero-visual, .section-intro, .platform-feature, .services-intro, .services-list article, .workflow-heading, .workflow-steps article, .questions-section > div, .faq-list details, .cta-inner'
    );
    if (!targets || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (
            !media.matches &&
            !entry.target.classList.contains('home-revealed')
          ) {
            (entry.target as HTMLElement).style.setProperty(
              '--entry-sign',
              entry.boundingClientRect.top < 0 ? '-1' : '1'
            );
            entry.target.classList.add('home-revealed');
          }
        }
      },
      { threshold: 0.12 }
    );
    targets.forEach((target) => observer.observe(target));
    const reset = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting)
            entry.target.classList.remove('home-revealed');
        });
      },
      { rootMargin: '180px 0px', threshold: 0 }
    );
    targets.forEach((target) => reset.observe(target));
    const ambient = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle('motion-in-view', entry.isIntersecting)
        );
      },
      { threshold: 0 }
    );
    root.current
      ?.querySelectorAll(
        '.hero, .platform-feature, .services-section, .workflow-section, .cta-section'
      )
      .forEach((section) => ambient.observe(section));
    return () => {
      observer.disconnect();
      reset.disconnect();
      ambient.disconnect();
    };
  }, []);
  return (
    <div
      ref={root}
      id="top"
      className="marketing-home"
      data-motion={paused ? 'paused' : 'playing'}
    >
      {children}
      <button
        className="home-motion-control"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
        {paused ? 'Resume motion' : 'Pause motion'}
      </button>
    </div>
  );
}

export function InteractivePass() {
  const [phase, setPhase] = useState<'ready' | 'scanning' | 'admitted'>(
    'ready'
  );
  const card = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (phase !== 'scanning') return;
    const timer = window.setTimeout(() => setPhase('admitted'), 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);
  const resetTilt = () => {
    card.current?.style.setProperty('--tilt-x', '0deg');
    card.current?.style.setProperty('--tilt-y', '0deg');
  };
  return (
    <div className="hero-pass interactive-pass" data-phase={phase}>
      <button
        ref={card}
        type="button"
        className="pass-demo-button"
        aria-label={
          phase === 'ready'
            ? 'Try the demo: scan this event pass'
            : phase === 'scanning'
              ? 'Demo pass is scanning'
              : 'Replay the event pass demo'
        }
        aria-disabled={phase === 'scanning'}
        onClick={() => {
          if (phase !== 'scanning')
            setPhase(phase === 'admitted' ? 'ready' : 'scanning');
        }}
        onPointerMove={(event) => {
          if (
            event.pointerType !== 'mouse' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
          )
            return;
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            '--tilt-x',
            `${(0.5 - (event.clientY - rect.top) / rect.height) * 10}deg`
          );
          event.currentTarget.style.setProperty(
            '--tilt-y',
            `${((event.clientX - rect.left) / rect.width - 0.5) * 10}deg`
          );
        }}
        onPointerLeave={resetTilt}
        onBlur={resetTilt}
      >
        <span className="pass-top">
          <span className="pass-icon">
            {phase === 'admitted' ? (
              <CheckCheck size={18} />
            ) : (
              <QrCode size={18} />
            )}
          </span>
          <span>
            The good kind of
            <br />
            <strong>all-access.</strong>
          </span>
          <ArrowUpRight size={18} />
        </span>
        <span className="pass-rule" />
        <span className="pass-body">
          <span>
            {phase === 'admitted' ? (
              <>
                You’re in.
                <br />
                Let’s connect.
              </>
            ) : (
              <>
                Less waiting.
                <br />
                More belonging.
              </>
            )}
          </span>
          <span className="pass-scan-code" aria-hidden="true">
            {phase === 'admitted' ? (
              <CheckCheck size={54} strokeWidth={1.4} />
            ) : (
              <QrCode size={54} strokeWidth={1.4} />
            )}
            <span className="pass-scan-line" />
          </span>
        </span>
        <span className="pass-demo-action" aria-hidden="true">
          {phase === 'admitted' ? (
            <RotateCcw size={14} />
          ) : (
            <ScanLine size={15} />
          )}
          {phase === 'ready'
            ? 'Tap to try your entrance'
            : phase === 'scanning'
              ? 'Checking your demo pass…'
              : 'Welcome in! Tap to replay'}
        </span>
        <span className="pass-demo-label">
          Interactive preview · Not a valid ticket
        </span>
      </button>
      <span className="sr-only" role="status">
        {phase === 'scanning'
          ? 'Scanning demo pass.'
          : phase === 'admitted'
            ? 'Demo check-in complete. Welcome in!'
            : 'Demo pass ready to scan.'}
      </span>
      <span className="pass-success-ring" aria-hidden="true" />
    </div>
  );
}
