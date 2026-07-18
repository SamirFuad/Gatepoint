import { CalendarCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Gatepoint</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Your event workspace is ready. Organization setup and event
            management are coming next in the implementation plan.
          </p>
        </div>
        <Button size="lg" disabled>
          <Plus />
          New event
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarCheck className="size-5" />
          </div>
          <div>
            <h2 className="font-medium">Authentication checkpoint</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign-in redirects now land on this protected dashboard route.
              The full dashboard shell is scheduled for Step 7.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

