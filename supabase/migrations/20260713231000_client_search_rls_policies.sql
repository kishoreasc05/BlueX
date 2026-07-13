-- Add RLS policy to allow all authenticated users (including clients) to select active contractors
create policy "anyone can view active contractors" 
on public.contractors 
for select 
to authenticated 
using (status = 'active');

-- Add RLS policy to allow all authenticated users (including clients) to select organizations
create policy "anyone can view organizations" 
on public.organizations 
for select 
to authenticated 
using (true);
