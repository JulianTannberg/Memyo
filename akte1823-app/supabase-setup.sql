-- AKTE 1823 – SUPABASE-EINRICHTUNG
-- Diesen gesamten Inhalt einmal im Supabase SQL Editor ausführen.

create extension if not exists pgcrypto;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  current_station integer not null default 0 check (current_station between 0 and 7),
  setup jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_players (
  game_id uuid not null references public.games(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (game_id, user_id)
);

create index if not exists game_players_user_id_idx on public.game_players(user_id);
create index if not exists games_code_idx on public.games(code);

alter table public.games enable row level security;
alter table public.game_players enable row level security;

-- Bestehende Policies bei erneutem Ausführen sauber ersetzen.
drop policy if exists "members can read their games" on public.games;
drop policy if exists "members can update their games" on public.games;
drop policy if exists "players can read own memberships" on public.game_players;

create policy "members can read their games"
on public.games
for select
to authenticated
using (
  exists (
    select 1
    from public.game_players gp
    where gp.game_id = games.id
      and gp.user_id = auth.uid()
  )
);

create policy "members can update their games"
on public.games
for update
to authenticated
using (
  exists (
    select 1
    from public.game_players gp
    where gp.game_id = games.id
      and gp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.game_players gp
    where gp.game_id = games.id
      and gp.user_id = auth.uid()
  )
);

create policy "players can read own memberships"
on public.game_players
for select
to authenticated
using (user_id = auth.uid());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists games_set_updated_at on public.games;
create trigger games_set_updated_at
before update on public.games
for each row execute function public.set_updated_at();

create or replace function public.create_game(p_code text)
returns public.games
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  clean_code text := upper(trim(p_code));
  new_game public.games;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if clean_code !~ '^[A-HJ-NP-Z2-9]{6}$' then
    raise exception 'Invalid game code';
  end if;

  insert into public.games (code, host_user_id)
  values (clean_code, auth.uid())
  returning * into new_game;

  insert into public.game_players (game_id, user_id)
  values (new_game.id, auth.uid());

  return new_game;
end;
$$;

create or replace function public.join_game_by_code(p_code text)
returns public.games
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  clean_code text := upper(trim(p_code));
  found_game public.games;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select *
  into found_game
  from public.games
  where code = clean_code;

  if not found then
    raise exception 'Game not found';
  end if;

  insert into public.game_players (game_id, user_id)
  values (found_game.id, auth.uid())
  on conflict (game_id, user_id) do nothing;

  return found_game;
end;
$$;

revoke all on function public.create_game(text) from public;
revoke all on function public.join_game_by_code(text) from public;
grant execute on function public.create_game(text) to authenticated;
grant execute on function public.join_game_by_code(text) to authenticated;

grant usage on schema public to authenticated;
grant select, update on public.games to authenticated;
grant select on public.game_players to authenticated;

alter table public.games replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'games'
  ) then
    alter publication supabase_realtime add table public.games;
  end if;
end $$;
