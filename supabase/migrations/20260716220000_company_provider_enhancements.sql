-- Add company registration and verification columns to provider_profiles if they do not exist
alter table public.provider_profiles 
  add column if not exists business_registration_number text,
  add column if not exists legal_representative text,
  add column if not exists website text,
  add column if not exists country text,
  add column if not exists vat_certificate_url text,
  add column if not exists company_logo_url text,
  add column if not exists business_license_url text;

-- Add assigned_employee_id to bookings table referencing profiles(id)
alter table public.bookings 
  add column if not exists assigned_employee_id uuid references public.profiles(id) on delete set null;

-- Update trigger handle_new_user_profiles to map company fields from auth signup metadata
create or replace function public.handle_new_user_profiles()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _role text;
  _provider_type text;
begin
  _role := coalesce(new.raw_user_meta_data->>'portal_role', 'client');
  
  -- Update profiles role
  update public.profiles set role = _role where id = new.id;
  
  if _role = 'client' then
    insert into public.customer_profiles (user_id, phone, address, city, postal_code, preferred_language)
    values (
      new.id,
      new.raw_user_meta_data->>'phone',
      new.raw_user_meta_data->>'address',
      new.raw_user_meta_data->>'city',
      new.raw_user_meta_data->>'postal_code',
      coalesce(new.raw_user_meta_data->>'preferred_language', 'en')
    )
    on conflict (user_id) do nothing;
  elsif _role = 'provider' then
    _provider_type := coalesce(new.raw_user_meta_data->>'provider_type', 'individual');
    insert into public.provider_profiles (
      user_id, 
      hourly_rate, 
      bio, 
      languages,
      provider_type,
      company_name,
      vat_number,
      business_registration_number,
      legal_representative,
      website,
      country
    )
    values (
      new.id,
      coalesce((new.raw_user_meta_data->>'hourly_rate')::numeric, 90.00),
      new.raw_user_meta_data->>'bio',
      coalesce(string_to_array(new.raw_user_meta_data->>'languages', ','), array['DE', 'EN']),
      _provider_type,
      new.raw_user_meta_data->>'company_name',
      new.raw_user_meta_data->>'vat_number',
      new.raw_user_meta_data->>'business_registration_number',
      new.raw_user_meta_data->>'legal_representative',
      new.raw_user_meta_data->>'website',
      new.raw_user_meta_data->>'country'
    )
    on conflict (user_id) do update set
      provider_type = excluded.provider_type,
      company_name = excluded.company_name,
      vat_number = excluded.vat_number,
      business_registration_number = excluded.business_registration_number,
      legal_representative = excluded.legal_representative,
      website = excluded.website,
      country = excluded.country;
  end if;
  
  return new;
end; $$;
