-- Add quick_booking_enabled to bookings table
alter table public.bookings 
add column if not exists quick_booking_enabled boolean not null default false;
