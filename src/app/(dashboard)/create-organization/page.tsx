import { Building2 } from 'lucide-react';
import { CreateOrganizationForm } from '@/features/organizations/components/organization-forms';

export const metadata = {
  title: 'Create Organization',
};

export default function CreateOrganizationPage() {
  return (
    <div className="mx-auto w-full max-w-xl animate-fade-in-up">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-accent ring-1 ring-primary/10">
          <Building2 className="size-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create your organization</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up a workspace to manage events with your team.
        </p>
      </div>
      <CreateOrganizationForm />
    </div>
  );
}
