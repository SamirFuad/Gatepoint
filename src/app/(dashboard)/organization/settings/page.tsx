import { redirect } from 'next/navigation';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';
import { OrganizationSettingsForm } from '@/features/organizations/components/organization-forms';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Organization Settings',
};

export default async function OrganizationSettingsPage() {
  const service = createOrganizationService();
  const result = await service.getUserOrganizations();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const organization = result.data?.[0];

  if (!organization) {
    redirect('/create-organization');
  }

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in-up">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Organization</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your organization profile and preferences.
        </p>
        <div className="mt-5 h-px bg-border" />
      </div>
      <OrganizationSettingsForm organization={organization} />
    </div>
  );
}
