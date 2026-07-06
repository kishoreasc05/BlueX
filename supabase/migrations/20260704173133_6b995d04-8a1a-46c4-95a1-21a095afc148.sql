
-- ============ ENUMS ============
create type public.org_role as enum ('owner', 'admin', 'member');
create type public.project_status as enum ('planning', 'active', 'on_hold', 'completed', 'cancelled');
create type public.task_status as enum ('todo', 'in_progress', 'blocked', 'done');
create type public.task_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.entity_status as enum ('active', 'inactive', 'archived');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by authenticated" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- ============ ORGANIZATIONS ============
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.org_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
grant select, insert, update, delete on public.organization_members to authenticated;
grant all on public.organization_members to service_role;
alter table public.organization_members enable row level security;

-- Security definer helpers (avoid RLS recursion)
create or replace function public.is_org_member(_org uuid, _user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.organization_members where organization_id = _org and user_id = _user)
$$;

create or replace function public.org_role(_org uuid, _user uuid)
returns public.org_role language sql stable security definer set search_path = public as $$
  select role from public.organization_members where organization_id = _org and user_id = _user
$$;

create or replace function public.is_org_admin(_org uuid, _user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.organization_members where organization_id = _org and user_id = _user and role in ('owner','admin'))
$$;

-- Org policies
create policy "members view their orgs" on public.organizations for select to authenticated
  using (public.is_org_member(id, auth.uid()));
create policy "any authenticated can create org" on public.organizations for insert to authenticated
  with check (auth.uid() = created_by);
create policy "admins update org" on public.organizations for update to authenticated
  using (public.is_org_admin(id, auth.uid())) with check (public.is_org_admin(id, auth.uid()));
create policy "owners delete org" on public.organizations for delete to authenticated
  using (public.org_role(id, auth.uid()) = 'owner');

-- Membership policies
create policy "members view org members" on public.organization_members for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "admins insert members" on public.organization_members for insert to authenticated
  with check (public.is_org_admin(organization_id, auth.uid()) or user_id = auth.uid());
create policy "admins update members" on public.organization_members for update to authenticated
  using (public.is_org_admin(organization_id, auth.uid())) with check (public.is_org_admin(organization_id, auth.uid()));
create policy "admins or self delete member" on public.organization_members for delete to authenticated
  using (public.is_org_admin(organization_id, auth.uid()) or user_id = auth.uid());

-- ============ INVITES ============
create table public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role public.org_role not null default 'member',
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.organization_invites to authenticated;
grant all on public.organization_invites to service_role;
alter table public.organization_invites enable row level security;
create policy "org members view invites" on public.organization_invites for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "admins create invites" on public.organization_invites for insert to authenticated
  with check (public.is_org_admin(organization_id, auth.uid()));
create policy "admins delete invites" on public.organization_invites for delete to authenticated
  using (public.is_org_admin(organization_id, auth.uid()));
create policy "admins update invites" on public.organization_invites for update to authenticated
  using (public.is_org_admin(organization_id, auth.uid())) with check (public.is_org_admin(organization_id, auth.uid()));

-- ============ CLIENTS ============
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  company text,
  email text,
  phone text,
  website text,
  notes text,
  status public.entity_status not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.clients to authenticated;
grant all on public.clients to service_role;
alter table public.clients enable row level security;
create policy "members view clients" on public.clients for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert clients" on public.clients for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update clients" on public.clients for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete clients" on public.clients for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));

-- ============ CONTRACTORS ============
create table public.contractors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  specialty text,
  hourly_rate numeric(10,2),
  notes text,
  status public.entity_status not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.contractors to authenticated;
grant all on public.contractors to service_role;
alter table public.contractors enable row level security;
create policy "members view contractors" on public.contractors for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert contractors" on public.contractors for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update contractors" on public.contractors for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete contractors" on public.contractors for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));

-- ============ PROJECTS ============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  description text,
  status public.project_status not null default 'planning',
  start_date date,
  due_date date,
  owner_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "members view projects" on public.projects for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert projects" on public.projects for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update projects" on public.projects for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete projects" on public.projects for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));

-- ============ TASKS ============
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  assignee_id uuid references auth.users(id) on delete set null,
  due_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.tasks to authenticated;
grant all on public.tasks to service_role;
alter table public.tasks enable row level security;
create policy "members view tasks" on public.tasks for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert tasks" on public.tasks for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update tasks" on public.tasks for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete tasks" on public.tasks for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));

-- ============ DOCUMENTS ============
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  file_path text not null,
  mime_type text,
  size_bytes bigint,
  ai_summary text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.documents to authenticated;
grant all on public.documents to service_role;
alter table public.documents enable row level security;
create policy "members view documents" on public.documents for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert documents" on public.documents for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()));
create policy "members update documents" on public.documents for update to authenticated
  using (public.is_org_member(organization_id, auth.uid())) with check (public.is_org_member(organization_id, auth.uid()));
create policy "members delete documents" on public.documents for delete to authenticated
  using (public.is_org_member(organization_id, auth.uid()));

-- ============ ACTIVITY LOG ============
create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;
create policy "members view activity" on public.activity_log for select to authenticated
  using (public.is_org_member(organization_id, auth.uid()));
create policy "members insert activity" on public.activity_log for insert to authenticated
  with check (public.is_org_member(organization_id, auth.uid()) and actor_id = auth.uid());

-- ============ UPDATED_AT TRIGGER ============
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger tr_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger tr_orgs_updated before update on public.organizations for each row execute function public.set_updated_at();
create trigger tr_clients_updated before update on public.clients for each row execute function public.set_updated_at();
create trigger tr_contractors_updated before update on public.contractors for each row execute function public.set_updated_at();
create trigger tr_projects_updated before update on public.projects for each row execute function public.set_updated_at();
create trigger tr_tasks_updated before update on public.tasks for each row execute function public.set_updated_at();
create trigger tr_documents_updated before update on public.documents for each row execute function public.set_updated_at();

-- ============ AUTO PROFILE + ORG ON SIGNUP ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _org_id uuid;
  _name text;
  _slug text;
begin
  _name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  insert into public.profiles(id, email, full_name)
    values (new.id, new.email, _name)
    on conflict (id) do nothing;

  _slug := lower(regexp_replace(_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(replace(new.id::text, '-', ''), 1, 8);
  insert into public.organizations(name, slug, created_by)
    values (_name || '''s Workspace', _slug, new.id)
    returning id into _org_id;

  insert into public.organization_members(organization_id, user_id, role)
    values (_org_id, new.id, 'owner');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============ STORAGE POLICIES ============
create policy "org members read documents storage" on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.is_org_member((storage.foldername(name))[1]::uuid, auth.uid()));
create policy "org members upload documents storage" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and public.is_org_member((storage.foldername(name))[1]::uuid, auth.uid()));
create policy "org members delete documents storage" on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and public.is_org_member((storage.foldername(name))[1]::uuid, auth.uid()));
