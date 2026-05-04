-- =============================================
-- ENGANCHA — Schema completo
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Extensions
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES
-- =============================================
create table if not exists profiles (
  id            uuid primary key default uuid_generate_v4(),
  clerk_id      text unique not null,
  email         text,
  name          text not null default '',
  age           int,
  bio           text,
  photos        text[] default '{}',
  modes         text[] default '{}',
  role          text not null default 'user'
                  check (role in ('user', 'venue_admin', 'super_admin')),
  current_venue_id uuid,
  current_sector   text,
  is_active     boolean default true,
  is_banned     boolean default false,
  lat           float,
  lng           float,
  last_seen     timestamptz default now(),
  created_at    timestamptz default now()
);

-- =============================================
-- VENUES (Locales)
-- =============================================
create table if not exists venues (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  address     text,
  lat         float not null,
  lng         float not null,
  radius      int default 500,
  is_active   boolean default true,
  created_by  uuid references profiles(id),
  created_at  timestamptz default now()
);

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'fk_current_venue'
  ) then
    alter table profiles
      add constraint fk_current_venue
      foreign key (current_venue_id) references venues(id) on delete set null;
  end if;
end $$;

-- =============================================
-- SECTORS (dentro de cada local)
-- =============================================
create table if not exists sectors (
  id          uuid primary key default uuid_generate_v4(),
  venue_id    uuid not null references venues(id) on delete cascade,
  name        text not null,
  order_index int default 0,
  is_active   boolean default true
);

-- =============================================
-- MODES CATALOG
-- =============================================
create table if not exists modes (
  id         uuid primary key default uuid_generate_v4(),
  key        text unique not null,
  label      text not null,
  emoji      text not null,
  color      text not null,
  is_active  boolean default true,
  created_at timestamptz default now()
);

insert into modes (key, label, emoji, color) values
  ('conocer',  'Solo conocer',       '🗣️', '#3B82F6'),
  ('piquito',  'Piquito por cover',  '💋', '#EC4899'),
  ('bailar',   'Bailar',             '💃', '#F59E0B'),
  ('diablo',   'Diablo',             '😈', '#E8192C'),
  ('trago',    'Tomar algo',         '🍻', '#10B981'),
  ('after',    'El after',           '🌙', '#7B2FBE')
on conflict (key) do nothing;

-- =============================================
-- LIKES
-- =============================================
create table if not exists likes (
  id           uuid primary key default uuid_generate_v4(),
  from_user_id uuid not null references profiles(id) on delete cascade,
  to_user_id   uuid not null references profiles(id) on delete cascade,
  venue_id     uuid references venues(id),
  created_at   timestamptz default now(),
  unique(from_user_id, to_user_id)
);

-- =============================================
-- MATCHES
-- =============================================
create table if not exists matches (
  id         uuid primary key default uuid_generate_v4(),
  user1_id   uuid not null references profiles(id) on delete cascade,
  user2_id   uuid not null references profiles(id) on delete cascade,
  venue_id   uuid references venues(id),
  matched_at timestamptz default now(),
  deadline   timestamptz default (now() + interval '30 minutes'),
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- =============================================
-- MESSAGES
-- =============================================
create table if not exists messages (
  id            uuid primary key default uuid_generate_v4(),
  match_id      uuid not null references matches(id) on delete cascade,
  sender_id     uuid not null references profiles(id) on delete cascade,
  text          text,
  is_ephemeral  boolean default false,
  photo_url     text,
  is_moderated  boolean default false,
  created_at    timestamptz default now(),
  read_at       timestamptz
);

-- =============================================
-- PUBLIC ROOMS (Salas públicas)
-- =============================================
create table if not exists public_rooms (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  lat        float not null,
  lng        float not null,
  radius     int default 200,
  is_active  boolean default true,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists room_messages (
  id         uuid primary key default uuid_generate_v4(),
  room_id    uuid not null references public_rooms(id) on delete cascade,
  sender_id  uuid not null references profiles(id) on delete cascade,
  text       text not null,
  is_bot     boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- BOTS
-- =============================================
create table if not exists bots (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  photo_url  text,
  bio        text,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- =============================================
-- REPORTS
-- =============================================
create table if not exists reports (
  id          uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  reported_id uuid not null references profiles(id) on delete cascade,
  reason      text not null,
  details     text,
  status      text default 'pending'
                check (status in ('pending', 'reviewed', 'actioned')),
  created_at  timestamptz default now()
);

-- =============================================
-- ANNOUNCEMENTS (Admin)
-- =============================================
create table if not exists announcements (
  id           uuid primary key default uuid_generate_v4(),
  venue_id     uuid references venues(id),
  type         text not null default 'message'
                 check (type in ('message', 'banner')),
  content      text not null,
  scheduled_at timestamptz,
  expires_at   timestamptz,
  created_by   uuid references profiles(id),
  created_at   timestamptz default now()
);

-- =============================================
-- TRIGGER: auto-asignar super_admin por email
-- =============================================
create or replace function handle_new_profile()
returns trigger as $$
begin
  if new.email = 'camilo.mg.beta@gmail.com' then
    new.role := 'super_admin';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_created on profiles;
create trigger on_profile_created
  before insert on profiles
  for each row execute function handle_new_profile();

-- =============================================
-- FUNCTION: match check (mutual like)
-- Llamar después de cada like para ver si hay match
-- =============================================
create or replace function check_and_create_match(
  p_from uuid,
  p_to   uuid,
  p_venue uuid default null
)
returns uuid as $$
declare
  v_match_id uuid;
begin
  -- Verificar si ya existe like recíproco
  if exists (
    select 1 from likes
    where from_user_id = p_to and to_user_id = p_from
  ) then
    -- Crear match
    insert into matches (user1_id, user2_id, venue_id)
    values (p_from, p_to, p_venue)
    returning id into v_match_id;

    return v_match_id;
  end if;
  return null;
end;
$$ language plpgsql;

-- =============================================
-- FUNCTION: extender/descongelar match al chatear
-- =============================================
create or replace function extend_match_deadline(p_match_id uuid)
returns void as $$
begin
  update matches
  set
    deadline  = now() + interval '30 minutes',
    is_active = true
  where id = p_match_id;
end;
$$ language plpgsql;

-- =============================================
-- REALTIME: habilitar para chat y matches
-- =============================================
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table room_messages;

-- =============================================
-- RLS (Row Level Security)
-- Por ahora deshabilitado para desarrollo rápido
-- Habilitar antes de ir a producción real
-- =============================================
-- alter table profiles enable row level security;
-- alter table likes enable row level security;
-- alter table matches enable row level security;
-- alter table messages enable row level security;

-- =============================================
-- INDEXES para performance
-- =============================================
create index if not exists idx_profiles_clerk_id on profiles(clerk_id);
create index if not exists idx_likes_from_user on likes(from_user_id);
create index if not exists idx_likes_to_user on likes(to_user_id);
create index if not exists idx_matches_user1 on matches(user1_id);
create index if not exists idx_matches_user2 on matches(user2_id);
create index if not exists idx_messages_match on messages(match_id);
create index if not exists idx_profiles_is_active on profiles(is_active);
