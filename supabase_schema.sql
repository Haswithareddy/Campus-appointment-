create table if not exists public.campus_services (
  service_id text primary key,
  name text not null,
  category text not null,
  office text not null,
  counter text not null,
  description text not null,
  avg_duration_minutes integer not null default 10,
  allow_digital boolean not null default false,
  allow_appointment boolean not null default false,
  emergency_quota_per_day integer not null default 0,
  emergency_slots_used_today integer not null default 0,
  current_queue_length integer not null default 0,
  active_staff_count integer not null default 0,
  operating_hours text not null,
  required_documents jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.campus_services enable row level security;

create policy "public can read campus services"
  on public.campus_services for select
  using (true);
