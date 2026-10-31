alter table public.registrations
add column if not exists phone text;

create unique index if not exists registrations_event_email_unique_idx
on public.registrations (event_id, lower(email));

create unique index if not exists registrations_event_phone_unique_idx
on public.registrations (event_id, phone)
where phone is not null;
