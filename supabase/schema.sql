-- =========================================================
-- SmartLedger Supabase PostgreSQL Schema
-- Swarnandhra College Hackathon 2026
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Documents table
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

-- Enable RLS for documents
alter table public.documents enable row level security;

create policy "Allow read and write for documents" on public.documents
  for all using (true) with check (true);

-- 2. Registered Users table
create table if not exists public.users (
  id text primary key,
  email text unique not null,
  password text not null,
  full_name text not null,
  role text not null,
  is_verified boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS for users
alter table public.users enable row level security;

create policy "Allow read and write for users" on public.users
  for all using (true) with check (true);
