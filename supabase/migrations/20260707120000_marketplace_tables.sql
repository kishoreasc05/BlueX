-- ============ SERVICE CATEGORIES ============
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.service_categories to authenticated;
grant all on public.service_categories to service_role;
alter table public.service_categories enable row level security;

create policy "service_categories readable by everyone" on public.service_categories for select using (true);
create policy "service_categories writable by authenticated" on public.service_categories for all to authenticated using (true);

-- ============ PROVIDER SERVICES ============
create table public.provider_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.organizations(id) on delete cascade,
  category_id uuid not null references public.service_categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  price_type text not null default 'hourly', -- 'hourly', 'fixed'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.provider_services to authenticated;
grant all on public.provider_services to service_role;
alter table public.provider_services enable row level security;

create policy "provider_services readable by everyone" on public.provider_services for select using (true);
create policy "provider_services writable by authenticated" on public.provider_services for all to authenticated using (true);

-- ============ BOOKINGS ============
create type public.booking_status as enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.organizations(id) on delete cascade,
  provider_service_id uuid references public.provider_services(id) on delete set null,
  status public.booking_status not null default 'pending',
  scheduled_at timestamptz not null,
  duration_hours numeric(4,2) not null default 1.00,
  total_price numeric(10,2) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;

create policy "bookings viewable by authenticated" on public.bookings for select to authenticated using (true);
create policy "bookings writable by authenticated" on public.bookings for all to authenticated using (true);

-- ============ REVIEWS ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.organizations(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;

create policy "reviews viewable by everyone" on public.reviews for select using (true);
create policy "reviews writable by authenticated" on public.reviews for all to authenticated using (true);

-- ============ PUBLIC TENDERS ============
create type public.tender_status as enum ('open', 'bidded', 'closed', 'cancelled');

create table public.public_tenders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.service_categories(id) on delete cascade,
  title text not null,
  description text,
  budget numeric(10,2),
  due_date date,
  status public.tender_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.public_tenders to authenticated;
grant all on public.public_tenders to service_role;
alter table public.public_tenders enable row level security;

create policy "public_tenders viewable by everyone" on public.public_tenders for select using (true);
create policy "public_tenders writable by authenticated" on public.public_tenders for all to authenticated using (true);

-- ============ TENDER BIDS ============
create type public.bid_status as enum ('pending', 'accepted', 'rejected');

create table public.tender_bids (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.public_tenders(id) on delete cascade,
  provider_id uuid not null references public.organizations(id) on delete cascade,
  amount numeric(10,2) not null,
  proposal text,
  status public.bid_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.tender_bids to authenticated;
grant all on public.tender_bids to service_role;
alter table public.tender_bids enable row level security;

create policy "tender_bids viewable by everyone" on public.tender_bids for select using (true);
create policy "tender_bids writable by authenticated" on public.tender_bids for all to authenticated using (true);

-- ============ MESSAGES ============
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;

create policy "messages viewable by sender or receiver" on public.messages for select to authenticated using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "messages insertable by sender" on public.messages for insert to authenticated with check (auth.uid() = sender_id);

-- ============ TRIGGERS & SEED DATA ============
create trigger tr_service_categories_updated before update on public.service_categories for each row execute function public.set_updated_at();
create trigger tr_provider_services_updated before update on public.provider_services for each row execute function public.set_updated_at();
create trigger tr_bookings_updated before update on public.bookings for each row execute function public.set_updated_at();
create trigger tr_reviews_updated before update on public.reviews for each row execute function public.set_updated_at();
create trigger tr_public_tenders_updated before update on public.public_tenders for each row execute function public.set_updated_at();
create trigger tr_tender_bids_updated before update on public.tender_bids for each row execute function public.set_updated_at();

insert into public.service_categories (name, slug, icon, description) values
  ('Electrician', 'electrician', 'Zap', 'Professional electrical installation, repair, and wiring services.'),
  ('Plumber', 'plumber', 'Droplet', 'Plumbing, leak repairs, pipe installation, and emergency service.'),
  ('Cleaner', 'cleaner', 'Sparkles', 'Home cleaning, office cleaning, deep cleaning, and move-out cleaning.'),
  ('Gardener', 'gardener', 'Leaf', 'Lawn care, garden maintenance, landscaping, and planting.'),
  ('Painter', 'painter', 'Paintbrush', 'Interior and exterior painting, wall finishing, and wallpapering.'),
  ('Carpenter', 'carpenter', 'Hammer', 'Custom furniture, woodwork, door repairs, and framing.'),
  ('Movers', 'movers', 'Truck', 'Home shifting, packing, transport, and office relocation.'),
  ('Childcare', 'childcare', 'Heart', 'Professional nannies, babysitting, and child care assistance.'),
  ('Pet Care', 'petcare', 'PawPrint', 'Dog walking, pet boarding, grooming, and pet sitting.')
on conflict (slug) do nothing;
