-- Add RLS policy to allow operations users (admins) to update provider profiles
create policy "operations users can update all provider profiles" 
on public.provider_profiles 
for update 
to authenticated 
using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'operations'
  )
);

-- Add RLS policy to allow operations users (admins) to update all user profiles
create policy "operations users can update all profiles" 
on public.profiles 
for update 
to authenticated 
using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'operations'
  )
);
