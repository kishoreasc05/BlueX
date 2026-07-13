-- Add customer profile fields to profiles table
alter table public.profiles
  add column if not exists phone text,
  add column if not exists date_of_birth date,
  add column if not exists gender text,
  add column if not exists preferred_lang text default 'de',
  add column if not exists home_address text,
  add column if not exists apartment_no text,
  add column if not exists postal_code text,
  add column if not exists city text default 'Zurich',
  add column if not exists canton text default 'ZH',
  add column if not exists country text default 'Switzerland';

-- Add a helper to compute customer ID (BX-xxxx) based on prefixing the UUID prefix
alter table public.profiles
  add column if not exists customer_id text generated always as ('BX-' || upper(substr(id::text, 1, 8))) stored;
