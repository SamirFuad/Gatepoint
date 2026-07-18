import { CreateOrganizationForm } from '@/features/organizations/components/organization-forms';

export const metadata = {
  title: 'Create Organization',
};

export default function CreateOrganizationPage() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <CreateOrganizationForm />
    </div>
  );
}

