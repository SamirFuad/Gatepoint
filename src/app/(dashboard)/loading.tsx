import { CardLoading, TableLoading } from '@/components/common/loading-state';
export default function WorkspaceLoading() {
  return (
    <div
      className="mx-auto flex max-w-6xl flex-col gap-8"
      role="status"
      aria-label="Loading your workspace"
    >
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
      <p className="text-sm text-muted-foreground">
        Bringing everything together…
      </p>
      <CardLoading count={3} />
      <TableLoading rows={4} />
    </div>
  );
}
