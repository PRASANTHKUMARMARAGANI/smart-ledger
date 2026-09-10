-- =========================================================
-- SmartLedger Supabase PostgreSQL Schema
-- Swarnandhra College Hackathon 2026
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Documents table
create table if not exists public.documents (
  id text primary key,
  vendor text not null,
  invoice_number text not null,
  date text not null,
  subtotal numeric not null default 0,
  tax_gst numeric not null default 0,
  total_amount numeric not null default 0,
  calculated_total numeric default 0,
  category text default 'General',
  status text not null check (status in ('Ready for Review', 'Needs Review', 'Approved', 'Rejected')),
  checks jsonb default '{}'::jsonb,
  issue_description text,
  items jsonb default '[]'::jsonb,
  uploaded_at timestamp with time zone default now(),
  file_name text,
  file_type text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.documents enable row level security;

-- Policy allowing authenticated & anon users for hackathon demo
create policy "Allow read and write for documents" on public.documents
  for all using (true) with check (true);
