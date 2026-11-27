-- Jalankan di Supabase → SQL Editor.
-- Publik: hanya boleh MEMBACA ucapan yang tidak disembunyikan dan MENAMBAH ucapan baru.
-- Tidak ada update/delete dari publik; moderasi lewat Table Editor (set is_hidden = true).

create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 60),
  message     text not null check (char_length(message) between 1 and 500),
  attendance  text check (attendance in ('hadir', 'tidak_hadir')),
  guest_key   text check (char_length(guest_key) <= 80),
  is_hidden   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Satu link tamu (?to=) hanya boleh mengirim satu ucapan → duplikat ditolak HTTP 409.
create unique index if not exists wishes_guest_key_uniq
  on public.wishes (guest_key) where guest_key is not null;

create index if not exists wishes_created_at_idx on public.wishes (created_at desc);

alter table public.wishes enable row level security;

drop policy if exists "wishes_public_read" on public.wishes;
create policy "wishes_public_read" on public.wishes
  for select to anon using (is_hidden = false);

drop policy if exists "wishes_public_insert" on public.wishes;
create policy "wishes_public_insert" on public.wishes
  for insert to anon with check (is_hidden = false);

-- Batasi kolom yang boleh ditulis publik (id/created_at/is_hidden diatur server).
revoke all on public.wishes from anon;
grant select (id, name, message, created_at, is_hidden) on public.wishes to anon;
grant insert (name, message, attendance, guest_key) on public.wishes to anon;
