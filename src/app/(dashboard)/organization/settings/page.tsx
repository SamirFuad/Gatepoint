import { WorkspacePageHeader } from '@/components/layout/workspace-page-header';
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
      <WorkspacePageHeader
        title="Workspace settings"
        description="Your organization, thoughtfully introduced. Manage your profile and preferences."
      />
      <OrganizationSettingsForm organization={organization} />
    </div>
  );
}
