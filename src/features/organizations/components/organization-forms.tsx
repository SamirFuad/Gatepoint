'use client';

import { useActionState } from 'react';
import { Loader2, Save, Trash2, UserPlus } from 'lucide-react';
import {
  createOrganizationAction,
  inviteMemberAction,
  removeMemberAction,
  updateMemberRoleAction,
  updateOrganizationAction,
  type OrganizationActionState,
} from '@/features/organizations/actions';
import type {
  Organization,
  OrganizationMember,
} from '@/features/organizations/services/organization-service.interface';
import { ROLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

const initialState: OrganizationActionState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: OrganizationActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={
        state.success
          ? 'rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary'
          : 'rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'
      }
    >
      {state.message}
    </p>
  );
}

function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      {children}
    </Button>
  );
}

export function CreateOrganizationForm() {
  const [state, action, pending] = useActionState(
    createOrganizationAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your organization</CardTitle>
        <CardDescription>
          Every event, registration, and team member belongs to a workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="name">Organization name</Label>
            <Input id="name" name="name" autoComplete="organization" />
            <FieldError errors={state.errors?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="auto-generated if empty"
              autoComplete="off"
            />
            <FieldError errors={state.errors?.slug} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              autoComplete="url"
            />
            <FieldError errors={state.errors?.website} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
            <FieldError errors={state.errors?.description} />
          </div>
          <SubmitButton pending={pending}>Create organization</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function OrganizationSettingsForm({
  organization,
}: {
  organization: Organization;
}) {
  const updateAction = updateOrganizationAction.bind(null, organization.id);
  const [state, action, pending] = useActionState(
    updateAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization settings</CardTitle>
        <CardDescription>
          Keep public workspace details accurate for your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Organization name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={organization.name}
                autoComplete="organization"
              />
              <FieldError errors={state.errors?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={organization.slug}
                autoComplete="off"
              />
              <FieldError errors={state.errors?.slug} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              defaultValue={organization.website ?? ''}
              autoComplete="url"
            />
            <FieldError errors={state.errors?.website} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={organization.description ?? ''}
            />
            <FieldError errors={state.errors?.description} />
          </div>
          <SubmitButton pending={pending}>
            <Save />
            Save changes
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function InviteMemberForm({
  organizationId,
}: {
  organizationId: string;
}) {
  const [state, action, pending] = useActionState(
    inviteMemberAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add member</CardTitle>
        <CardDescription>
          Add an existing Gatepoint user to this organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4 lg:grid-cols-[1fr_180px_auto]">
          <input type="hidden" name="organizationId" value={organizationId} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
            <FieldError errors={state.errors?.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              defaultValue={ROLES.ORGANIZER}
              className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.ORGANIZER}>Organizer</option>
              <option value={ROLES.STAFF}>Staff</option>
            </select>
            <FieldError errors={state.errors?.role} />
          </div>
          <div className="flex items-end">
            <SubmitButton pending={pending}>
              <UserPlus />
              Add
            </SubmitButton>
          </div>
          <div className="lg:col-span-3">
            <FormMessage state={state} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function MembersTable({ members }: { members: OrganizationMember[] }) {
  const [roleState, roleAction, rolePending] = useActionState(
    updateMemberRoleAction,
    initialState
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeMemberAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          Manage access for people who can work in this organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormMessage state={roleState.message ? roleState : removeState} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="font-medium">
                    {member.user.fullName ?? member.user.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {member.user.email}
                  </div>
                </TableCell>
                <TableCell>
                  {member.role === ROLES.OWNER ? (
                    <span className="text-sm capitalize">{member.role}</span>
                  ) : (
                    <form action={roleAction} className="flex items-center gap-2">
                      <input type="hidden" name="memberId" value={member.id} />
                      <select
                        name="role"
                        defaultValue={member.role}
                        className="h-8 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value={ROLES.ADMIN}>Admin</option>
                        <option value={ROLES.ORGANIZER}>Organizer</option>
                        <option value={ROLES.STAFF}>Staff</option>
                      </select>
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        disabled={rolePending}
                      >
                        Save
                      </Button>
                    </form>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {member.role !== ROLES.OWNER ? (
                    <form action={removeAction}>
                      <input type="hidden" name="memberId" value={member.id} />
                      <Button
                        type="submit"
                        size="icon-sm"
                        variant="destructive"
                        disabled={removePending}
                        aria-label={`Remove ${member.user.email}`}
                      >
                        <Trash2 />
                      </Button>
                    </form>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

