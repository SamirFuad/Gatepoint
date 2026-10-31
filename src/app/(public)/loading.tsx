import { CardLoading } from '@/components/common/loading-state';
export default function PublicLoading() {
  return (
    <main
      className="site-container py-16"
      role="status"
      aria-label="Loading events"
    >
      <div className="mb-8 h-12 w-2/3 animate-pulse rounded-lg bg-muted" />
      <p className="mb-8 text-sm text-muted-foreground">
        Finding your next connection…
      </p>
      <CardLoading count={3} />
    </main>
  );
}
