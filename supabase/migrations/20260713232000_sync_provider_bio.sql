-- Update trigger handle_verified_provider_contractor to sync the bio/about text to contractors.notes
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

  -- If no organization exists, create one as fallback with guaranteed unique slug
  if _org_id is null then
    insert into public.organizations (name, slug, created_by)
    values (
      coalesce(_name, 'Provider') || '''s Workspace', 
      'workspace-' || lower(regexp_replace(coalesce(_name, 'provider'), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(new.user_id::text from 1 for 8), 
      new.user_id
    )
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

    -- Upsert into public.contractors including notes/bio
    insert into public.contractors (id, organization_id, name, email, phone, specialty, hourly_rate, notes, status, created_by)
    values (
      new.user_id,
      _org_id,
      coalesce(_name, 'Independent Provider'),
      _email,
      _phone,
      _specialty_list,
      new.hourly_rate,
      new.bio,
      'active',
      new.user_id
    )
    on conflict (id) do update set
      organization_id = excluded.organization_id,
      name = excluded.name,
      specialty = excluded.specialty,
      hourly_rate = excluded.hourly_rate,
      notes = excluded.notes,
      status = 'active';
  else
    -- If verification is revoked, set contractor status to inactive
    update public.contractors set status = 'inactive' where id = new.user_id;
  end if;
  return new;
end; $$;
