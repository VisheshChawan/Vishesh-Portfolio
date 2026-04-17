create table if not exists portfolio_settings (
  id bigint primary key default 1,
  config jsonb not null,
  updated_at timestamp with time zone default now(),
  constraint single_row check (id = 1)
);

alter table portfolio_settings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public Read' and tablename = 'portfolio_settings') then
    create policy "Public Read" on portfolio_settings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Service Role All' and tablename = 'portfolio_settings') then
    create policy "Service Role All" on portfolio_settings for all using (auth.role() = 'service_role');
  end if;
end
$$;
