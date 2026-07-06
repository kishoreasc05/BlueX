-- ============ CONTRACTS ============
create type public.contract_status as enum ('draft', 'sent', 'signed', 'expired', 'cancelled');

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  value numeric(12,2),
  status public.contract_status not null default 'draft',
  contract_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.contracts to authenticated;
grant all on public.contracts to service_role;
alter table public.contracts enable row level security;
create policy "members view contracts" on public.contracts for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert contracts" on public.contracts for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update contracts" on public.contracts for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete contracts" on public.contracts for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));

-- ============ JOBS ============
create type public.job_status as enum ('open', 'interviewing', 'closed', 'paused');

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  department text,
  location text,
  status public.job_status not null default 'open',
  applicants integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.jobs to authenticated;
grant all on public.jobs to service_role;
alter table public.jobs enable row level security;
create policy "members view jobs" on public.jobs for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert jobs" on public.jobs for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update jobs" on public.jobs for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete jobs" on public.jobs for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));

-- ============ WORKFLOWS ============
create type public.workflow_status as enum ('active', 'paused');

create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  trigger_condition text,
  status public.workflow_status not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.workflows to authenticated;
grant all on public.workflows to service_role;
alter table public.workflows enable row level security;
create policy "members view workflows" on public.workflows for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert workflows" on public.workflows for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update workflows" on public.workflows for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete workflows" on public.workflows for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
