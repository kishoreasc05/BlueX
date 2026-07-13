-- Trigger function to sync provider_profiles with contractors
create or replace function public.handle_verified_provider_contractor()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _org_id uuid;
  _name text;
  _email text;
  _phone text;
  _specialty_list text;
begin
  -- Get user profile name and email
  select full_name, email into _name, _email from public.profiles where id = new.user_id;
  
  -- Get phone number if present
  select phone into _phone from public.customer_profiles where user_id = new.user_id;
  
  -- Get their organization workspace
  select id into _org_id from public.organizations where created_by = new.user_id limit 1;

  -- If no organization exists, create one as fallback
  if _org_id is null then
    insert into public.organizations (name, slug, created_by)
    values (_name || '''s Workspace', 'workspace-' || lower(regexp_replace(_name, '[^a-zA-Z0-9]+', '-', 'g')), new.user_id)
    returning id into _org_id;
  end if;

  -- If status is approved and is_verified is true
  if new.verification_status = 'approved' and new.is_verified = true then
    -- Aggregate categories from their services
    select string_agg(distinct sc.slug, ', ') into _specialty_list
    from public.provider_services ps
    join public.service_categories sc on ps.category_id = sc.id
    where ps.provider_id = _org_id;

    -- Fallback to primary skill if no services are defined yet
    if _specialty_list is null or _specialty_list = '' then
      if array_length(new.skills, 1) > 0 then
        _specialty_list := lower(new.skills[1]);
      else
        _specialty_list := 'general';
      end if;
    end if;

    -- Upsert into public.contractors
    insert into public.contractors (id, organization_id, name, email, phone, specialty, hourly_rate, status, created_by)
    values (
      new.user_id,
      _org_id,
      _name,
      _email,
      _phone,
      _specialty_list,
      new.hourly_rate,
      'active',
      new.user_id
    )
    on conflict (id) do update set
      organization_id = excluded.organization_id,
      name = excluded.name,
      specialty = excluded.specialty,
      hourly_rate = excluded.hourly_rate,
      status = 'active';
  else
    -- If verification is revoked, set contractor status to inactive
    update public.contractors set status = 'inactive' where id = new.user_id;
  end if;
  return new;
end; $$;

drop trigger if exists tr_provider_contractor_sync on public.provider_profiles;
create trigger tr_provider_contractor_sync
after insert or update on public.provider_profiles
for each row execute function public.handle_verified_provider_contractor();

-- Trigger function to trigger sync when provider services are modified
create or replace function public.handle_provider_services_contractor_sync()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _owner_id uuid;
  _profile_record public.provider_profiles%rowtype;
begin
  -- Resolve the owner of the organization
  select created_by into _owner_id from public.organizations where id = coalesce(new.provider_id, old.provider_id) limit 1;
  
  if _owner_id is not null then
    -- Find their provider profile
    select * into _profile_record from public.provider_profiles where user_id = _owner_id;
    if _profile_record.user_id is not null then
      -- Trigger an update on the provider profile to fire the sync trigger
      update public.provider_profiles 
      set updated_at = now() 
      where user_id = _owner_id;
    end if;
  end if;
  
  return coalesce(new, old);
end; $$;

drop trigger if exists tr_provider_services_sync on public.provider_services;
create trigger tr_provider_services_sync
after insert or update or delete on public.provider_services
for each row execute function public.handle_provider_services_contractor_sync();
