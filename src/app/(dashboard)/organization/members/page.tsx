import { redirect } from 'next/navigation';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';
import {
  InviteMemberForm,
  MembersTable,
} from '@/features/organizations/components/organization-forms';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Organization Members',
};

export default async function OrganizationMembersPage() {
  const service = createOrganizationService();
  const organizationsResult = await service.getUserOrganizations();

  if (organizationsResult.error) {
    throw new Error(organizationsResult.error.message);
  }

  const organization = organizationsResult.data?.[0];

  if (!organization) {
    redirect('/create-organization');
  }

  const membersResult = await service.getMembers(organization.id, {
    page: 1,
    pageSize: 50,
  });

  if (membersResult.error) {
    throw new Error(membersResult.error.message);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fade-in-up">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Organization</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Members</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage team access and invite new members.
        </p>
        <div className="mt-5 h-px bg-border" />
      </div>
      <InviteMemberForm organizationId={organization.id} />
      <MembersTable members={membersResult.data?.data ?? []} />
    </div>
  );
}
