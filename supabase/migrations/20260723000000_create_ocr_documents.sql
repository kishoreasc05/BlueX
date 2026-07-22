-- Migration: Create OCR Documents Table & Provider Auto-Approval via OCR
-- Description: Supports local Tesseract.js text extraction, Cloudinary URL storage, and auto-approval for provider verification.

create table if not exists public.ocr_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  document_name text not null,
  document_type text not null default 'pdf',
  category text not null default 'general' check (category in ('verification_license', 'tax_id', 'id_proof', 'contract', 'general')),
  file_url text,
  cloudinary_public_id text,
  thumbnail_url text,
  extracted_text text,
  confidence numeric(5,2) default 0.00,
  auto_approved boolean not null default false,
  status text not null default 'completed' check (status in ('processing', 'completed', 'failed')),
  processing_time_ms integer default 0,
  language text default 'eng',
  file_size_bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Grant privileges
grant select, insert, update, delete on public.ocr_documents to authenticated;
grant all on public.ocr_documents to service_role;

-- Enable RLS
alter table public.ocr_documents enable row level security;

-- Policies for ocr_documents
create policy "Users can view own or org OCR documents" on public.ocr_documents
  for select to authenticated
  using (
    auth.uid() = user_id 
    or (organization_id is not null and organization_id in (
      select organization_id from public.organization_members where user_id = auth.uid()
    ))
    or exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin', 'operations')
    )
  );

create policy "Users can insert own OCR documents" on public.ocr_documents
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own OCR documents" on public.ocr_documents
  for update to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin', 'operations')
    )
  );

create policy "Users can delete own OCR documents" on public.ocr_documents
  for delete to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin', 'operations')
    )
  );

-- Indexes for performance
create index if not exists idx_ocr_documents_user_id on public.ocr_documents(user_id);
create index if not exists idx_ocr_documents_org_id on public.ocr_documents(organization_id);
create index if not exists idx_ocr_documents_category on public.ocr_documents(category);
create index if not exists idx_ocr_documents_created_at on public.ocr_documents(created_at desc);

-- Function for Provider Auto-Approval via OCR
create or replace function public.auto_approve_provider_via_ocr(
  p_user_id uuid,
  p_doc_id uuid,
  p_confidence numeric
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Update OCR document status
  update public.ocr_documents
  set auto_approved = true,
      updated_at = now()
  where id = p_doc_id;

  -- Automatically approve provider profile
  update public.provider_profiles
  set verification_status = 'approved',
      is_verified = true,
      updated_at = now()
  where user_id = p_user_id;

  -- Log to activity_log if table exists
  if exists (select 1 from information_schema.tables where table_name = 'activity_log') then
    insert into public.activity_log (actor_id, action, entity_type, metadata)
    values (
      p_user_id,
      'auto_approved_provider_ocr',
      'provider_profile',
      jsonb_build_object(
        'document_id', p_doc_id,
        'confidence', p_confidence,
        'approved_at', now()
      )
    );
  end if;

  return true;
exception
  when others then
    return false;
end;
$$;
