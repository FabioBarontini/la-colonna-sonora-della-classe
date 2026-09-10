create table if not exists public.songs (
 id uuid primary key default gen_random_uuid(),
 student_name text not null,
 title text not null,
 artist text not null,
 youtube_url text not null,
 reason text not null,
 created_at timestamptz not null default now()
);
alter table public.songs enable row level security;
-- Le inserzioni/letture del sito passano dalle API server-side con service role.
-- Crea il tuo account docente in Supabase Authentication > Users.
