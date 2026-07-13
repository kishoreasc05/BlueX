-- Add role to public.profiles if it doesn't exist
alter table public.profiles add column if not exists role text default 'client' check (role in ('client', 'provider', 'operations'));

-- Create customer profiles table
create table if not exists public.customer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  phone text,
  address text,
  city text,
  postal_code text,
  preferred_language text default 'en',
  two_factor_enabled boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.customer_profiles to authenticated;
grant all on public.customer_profiles to service_role;
alter table public.customer_profiles enable row level security;

create policy "users read own customer profile" on public.customer_profiles for select to authenticated using (auth.uid() = user_id);
create policy "users update own customer profile" on public.customer_profiles for update to authenticated using (auth.uid() = user_id);
create policy "users insert own customer profile" on public.customer_profiles for insert to authenticated with check (auth.uid() = user_id);

-- Create provider profiles table
create table if not exists public.provider_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  skills text[] default '{}',
  experience_years integer default 0,
  hourly_rate numeric(10,2) default 90.00,
  bio text,
  languages text[] default '{"DE", "EN"}',
  verification_status text not null default 'none' check (verification_status in ('none', 'pending_verification', 'pending_approval', 'approved', 'rejected')),
  id_document_url text,
  selfie_url text,
  address_proof_url text,
  certificates text[] default '{}',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.provider_profiles to authenticated;
grant all on public.provider_profiles to service_role;
alter table public.provider_profiles enable row level security;

create policy "provider_profiles viewable by everyone" on public.provider_profiles for select using (true);
create policy "users update own provider profile" on public.provider_profiles for update to authenticated using (auth.uid() = user_id);
create policy "users insert own provider profile" on public.provider_profiles for insert to authenticated with check (auth.uid() = user_id);

-- Trigger to automatically create customer/provider profile when user is created
create or replace function public.handle_new_user_profiles()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _role text;
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
    insert into public.provider_profiles (user_id, hourly_rate, bio, languages)
    values (
      new.id,
      coalesce((new.raw_user_meta_data->>'hourly_rate')::numeric, 90.00),
      new.raw_user_meta_data->>'bio',
      coalesce(string_to_array(new.raw_user_meta_data->>'languages', ','), array['DE', 'EN'])
    )
    on conflict (user_id) do nothing;
  end if;
  
  return new;
end; $$;

drop trigger if exists tr_new_user_profiles on auth.users;
create trigger tr_new_user_profiles
after insert on auth.users
for each row execute function public.handle_new_user_profiles();
