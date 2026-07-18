-- Gatepoint Phase 1 initial schema

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  website text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_members_role_check check (
    role in ('owner', 'admin', 'organizer', 'staff')
  ),
  constraint organization_members_unique_user unique (organization_id, user_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  slug text not null unique,
  description text,
  event_type text not null,
  status text not null default 'draft',
  venue_name text,
  venue_address text,
  timezone text not null default 'UTC',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  max_attendees integer,
  settings jsonb not null default '{}'::jsonb,
  landing_page_config jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint events_type_check check (
    event_type in (
      'conference',
      'workshop',
      'seminar',
      'webinar',
      'exhibition',
      'meetup',
      'corporate',
      'government',
      'academic',
      'other'
    )
  ),
  constraint events_status_check check (
    status in ('draft', 'published', 'cancelled', 'completed')
  ),
  constraint events_time_order_check check (ends_at > starts_at),
  constraint events_registration_window_check check (
    registration_closes_at is null
    or registration_opens_at is null
    or registration_closes_at > registration_opens_at
  ),
  constraint events_max_attendees_check check (
    max_attendees is null or max_attendees > 0
  ),
  constraint events_id_organization_id_unique unique (id, organization_id)
);

create table public.registration_forms (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint registration_forms_unique_event unique (event_id),
  constraint registration_forms_id_event_id_unique unique (id, event_id),
  constraint registration_forms_org_event_consistency foreign key (
    event_id,
    organization_id
  ) references public.events(id, organization_id) on delete cascade
);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.registration_forms(id) on delete cascade,
  field_type text not null,
  label text not null,
  placeholder text,
  is_required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  validation_rules jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint form_fields_type_check check (
    field_type in (
      'text',
      'email',
      'phone',
      'textarea',
      'select',
      'multi_select',
      'checkbox',
      'radio',
      'date',
      'number',
      'url',
      'file'
    )
  )
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  form_id uuid not null references public.registration_forms(id) on delete restrict,
  confirmation_number text not null unique,
  email text not null,
  full_name text not null,
  status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  registered_at timestamptz not null default now(),
  cancelled_at timestamptz,
  checked_in_at timestamptz,
  constraint registrations_status_check check (
    status in ('pending', 'confirmed', 'cancelled', 'waitlisted', 'checked_in')
  ),
  constraint registrations_email_format check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  constraint registrations_org_event_consistency foreign key (
    event_id,
    organization_id
  ) references public.events(id, organization_id) on delete cascade,
  constraint registrations_id_event_id_unique unique (id, event_id),
  constraint registrations_form_event_consistency foreign key (
    form_id,
    event_id
  ) references public.registration_forms(id, event_id) on delete restrict
);

create table public.registration_responses (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  field_id uuid not null references public.form_fields(id) on delete restrict,
  value text,
  constraint registration_responses_unique_field unique (
    registration_id,
    field_id
  )
);

create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references public.registrations(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null unique,
  qr_image_url text,
  is_used boolean not null default false,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint qr_codes_org_event_consistency foreign key (
    event_id,
    organization_id
  ) references public.events(id, organization_id) on delete cascade,
  constraint qr_codes_registration_event_consistency foreign key (
    registration_id,
    event_id
  ) references public.registrations(id, event_id) on delete cascade
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.create_organization_with_owner(
  organization_name text,
  organization_slug text,
  organization_description text default null,
  organization_website text default null
)
returns public.organizations
language plpgsql
security definer
set search_path = public
as $$
declare
  created_organization public.organizations;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.organizations (
    name,
    slug,
    description,
    website
  )
  values (
    organization_name,
    organization_slug,
    nullif(organization_description, ''),
    nullif(organization_website, '')
  )
  returning * into created_organization;

  insert into public.organization_members (
    organization_id,
    user_id,
    role
  )
  values (
    created_organization.id,
    auth.uid(),
    'owner'
  );

  return created_organization;
end;
$$;

create or replace function public.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.user_id = auth.uid()
  );
$$;

create or replace function public.has_org_role(
  target_organization_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = target_organization_id
      and om.user_id = auth.uid()
      and om.role = any(allowed_roles)
  );
$$;

create or replace function public.is_event_org_member(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.events e
    join public.organization_members om
      on om.organization_id = e.organization_id
    where e.id = target_event_id
      and om.user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_event(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.events e
    join public.organization_members om
      on om.organization_id = e.organization_id
    where e.id = target_event_id
      and om.user_id = auth.uid()
      and om.role in ('owner', 'admin', 'organizer')
  );
$$;

create or replace function public.can_admin_event(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.events e
    join public.organization_members om
      on om.organization_id = e.organization_id
    where e.id = target_event_id
      and om.user_id = auth.uid()
      and om.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_registration_org_member(
  target_registration_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.registrations r
    join public.organization_members om
      on om.organization_id = r.organization_id
    where r.id = target_registration_id
      and om.user_id = auth.uid()
  );
$$;

create or replace function public.can_admin_registration(
  target_registration_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.registrations r
    join public.organization_members om
      on om.organization_id = r.organization_id
    where r.id = target_registration_id
      and om.user_id = auth.uid()
      and om.role in ('owner', 'admin')
  );
$$;

create or replace function public.can_submit_registration_response(
  target_registration_id uuid,
  target_field_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.registrations r
    join public.registration_forms rf on rf.id = r.form_id
    join public.form_fields ff on ff.form_id = rf.id
    join public.events e on e.id = r.event_id
    where r.id = target_registration_id
      and ff.id = target_field_id
      and e.is_published = true
      and e.status = 'published'
      and rf.is_active = true
  );
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create trigger auth_users_create_profile
after insert on auth.users
for each row execute function public.handle_new_user();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger registration_forms_set_updated_at
before update on public.registration_forms
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index organizations_slug_idx on public.organizations (slug);
create index organization_members_user_id_idx on public.organization_members (user_id);
create index organization_members_organization_id_idx on public.organization_members (organization_id);
create index events_organization_id_idx on public.events (organization_id);
create index events_created_by_idx on public.events (created_by);
create index events_slug_idx on public.events (slug);
create index events_status_idx on public.events (status);
create index events_starts_at_idx on public.events (starts_at);
create index events_public_lookup_idx on public.events (slug)
  where is_published = true and status = 'published';
create index registration_forms_event_id_idx on public.registration_forms (event_id);
create index registration_forms_organization_id_idx on public.registration_forms (organization_id);
create index form_fields_form_id_sort_order_idx on public.form_fields (form_id, sort_order);
create index registrations_event_id_idx on public.registrations (event_id);
create index registrations_organization_id_idx on public.registrations (organization_id);
create index registrations_form_id_idx on public.registrations (form_id);
create index registrations_email_idx on public.registrations (email);
create index registrations_status_idx on public.registrations (status);
create index registration_responses_registration_id_idx
  on public.registration_responses (registration_id);
create index registration_responses_field_id_idx
  on public.registration_responses (field_id);
create index qr_codes_registration_id_idx on public.qr_codes (registration_id);
create index qr_codes_event_id_idx on public.qr_codes (event_id);
create index qr_codes_organization_id_idx on public.qr_codes (organization_id);
create index qr_codes_code_idx on public.qr_codes (code);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.events enable row level security;
alter table public.registration_forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.registrations enable row level security;
alter table public.registration_responses enable row level security;
alter table public.qr_codes enable row level security;

create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Members can read organizations"
on public.organizations for select
to authenticated
using (public.is_org_member(id));

create policy "Authenticated users can create organizations"
on public.organizations for insert
to authenticated
with check (true);

create policy "Owners and admins can update organizations"
on public.organizations for update
to authenticated
using (public.has_org_role(id, array['owner', 'admin']))
with check (public.has_org_role(id, array['owner', 'admin']));

create policy "Owners can delete organizations"
on public.organizations for delete
to authenticated
using (public.has_org_role(id, array['owner']));

create policy "Members can read organization memberships"
on public.organization_members for select
to authenticated
using (public.is_org_member(organization_id));

create policy "Owners and admins can add organization members"
on public.organization_members for insert
to authenticated
with check (public.has_org_role(organization_id, array['owner', 'admin']));

create policy "Owners and admins can update organization members"
on public.organization_members for update
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']))
with check (public.has_org_role(organization_id, array['owner', 'admin']));

create policy "Owners and admins can remove organization members"
on public.organization_members for delete
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']));

create policy "Members can read events"
on public.events for select
to authenticated
using (public.is_org_member(organization_id));

create policy "Anyone can read published public events"
on public.events for select
to anon, authenticated
using (is_published = true and status = 'published');

create policy "Organizers can create events"
on public.events for insert
to authenticated
with check (
  public.has_org_role(organization_id, array['owner', 'admin', 'organizer'])
  and created_by = auth.uid()
);

create policy "Organizers can update events"
on public.events for update
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin', 'organizer']))
with check (public.has_org_role(organization_id, array['owner', 'admin', 'organizer']));

create policy "Owners and admins can delete events"
on public.events for delete
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']));

create policy "Members can read registration forms"
on public.registration_forms for select
to authenticated
using (public.is_org_member(organization_id));

create policy "Anyone can read active public registration forms"
on public.registration_forms for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.events e
    where e.id = registration_forms.event_id
      and e.is_published = true
      and e.status = 'published'
  )
);

create policy "Organizers can create registration forms"
on public.registration_forms for insert
to authenticated
with check (public.has_org_role(organization_id, array['owner', 'admin', 'organizer']));

create policy "Organizers can update registration forms"
on public.registration_forms for update
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin', 'organizer']))
with check (public.has_org_role(organization_id, array['owner', 'admin', 'organizer']));

create policy "Owners and admins can delete registration forms"
on public.registration_forms for delete
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']));

create policy "Members can read form fields"
on public.form_fields for select
to authenticated
using (
  exists (
    select 1
    from public.registration_forms rf
    where rf.id = form_fields.form_id
      and public.is_org_member(rf.organization_id)
  )
);

create policy "Anyone can read active public form fields"
on public.form_fields for select
to anon, authenticated
using (
  exists (
    select 1
    from public.registration_forms rf
    join public.events e on e.id = rf.event_id
    where rf.id = form_fields.form_id
      and rf.is_active = true
      and e.is_published = true
      and e.status = 'published'
  )
);

create policy "Organizers can create form fields"
on public.form_fields for insert
to authenticated
with check (
  exists (
    select 1
    from public.registration_forms rf
    where rf.id = form_fields.form_id
      and public.has_org_role(rf.organization_id, array['owner', 'admin', 'organizer'])
  )
);

create policy "Organizers can update form fields"
on public.form_fields for update
to authenticated
using (
  exists (
    select 1
    from public.registration_forms rf
    where rf.id = form_fields.form_id
      and public.has_org_role(rf.organization_id, array['owner', 'admin', 'organizer'])
  )
)
with check (
  exists (
    select 1
    from public.registration_forms rf
    where rf.id = form_fields.form_id
      and public.has_org_role(rf.organization_id, array['owner', 'admin', 'organizer'])
  )
);

create policy "Organizers can delete form fields"
on public.form_fields for delete
to authenticated
using (
  exists (
    select 1
    from public.registration_forms rf
    where rf.id = form_fields.form_id
      and public.has_org_role(rf.organization_id, array['owner', 'admin', 'organizer'])
  )
);

create policy "Members can read registrations"
on public.registrations for select
to authenticated
using (public.is_org_member(organization_id));

create policy "Anyone can create registrations for published events"
on public.registrations for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.events e
    join public.registration_forms rf on rf.event_id = e.id
    where e.id = registrations.event_id
      and rf.id = registrations.form_id
      and e.organization_id = registrations.organization_id
      and rf.organization_id = registrations.organization_id
      and e.is_published = true
      and e.status = 'published'
      and rf.is_active = true
      and (e.registration_opens_at is null or e.registration_opens_at <= now())
      and (e.registration_closes_at is null or e.registration_closes_at >= now())
  )
);

create policy "Members can update registrations"
on public.registrations for update
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "Owners and admins can delete registrations"
on public.registrations for delete
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']));

create policy "Members can read registration responses"
on public.registration_responses for select
to authenticated
using (public.is_registration_org_member(registration_id));

create policy "Anyone can create registration responses"
on public.registration_responses for insert
to anon, authenticated
with check (
  public.can_submit_registration_response(registration_id, field_id)
);

create policy "Owners and admins can delete registration responses"
on public.registration_responses for delete
to authenticated
using (public.can_admin_registration(registration_id));

create policy "Members can read QR codes"
on public.qr_codes for select
to authenticated
using (public.is_org_member(organization_id));

create policy "Owners and admins can delete QR codes"
on public.qr_codes for delete
to authenticated
using (public.has_org_role(organization_id, array['owner', 'admin']));

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'org-logos',
    'org-logos',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'event-images',
    'event-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'qr-codes',
    'qr-codes',
    false,
    5242880,
    array['image/png', 'image/svg+xml']
  )
on conflict (id) do nothing;
