-- Contact form submissions. Written only by the /api/contact serverless
-- function using the service_role key (which bypasses RLS).
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 254),
  message     text not null check (char_length(message) between 1 and 2000),
  status      text not null default 'new' check (status in ('new', 'read', 'replied', 'spam')),
  email_sent  boolean not null default false,
  ip_hash     text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_ip_hash_created_idx
  on public.contact_messages (ip_hash, created_at desc);

-- RLS on with no policies = anon/authenticated keys can't read or write anything.
alter table public.contact_messages enable row level security;
