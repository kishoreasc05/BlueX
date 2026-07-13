-- Add company verification columns to provider_profiles table
alter table public.provider_profiles 
  add column if not exists provider_type text not null default 'individual' check (provider_type in ('individual', 'company')),
  add column if not exists company_name text,
  add column if not exists vat_number text,
  add column if not exists business_registration_url text,
  add column if not exists liability_insurance_url text;
