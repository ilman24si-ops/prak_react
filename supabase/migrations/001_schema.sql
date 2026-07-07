-- PRD Schema: profiles, products, customers, orders, order_items
-- Run this in Supabase SQL Editor

-- Drop legacy profiles if migrating from old schema (email-based)
-- drop table if exists public.profiles cascade;

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  role text default 'Member'::text check (role in ('Admin', 'Member')),
  points integer default 0 not null,
  tier text default 'Bronze'::text check (tier in ('Bronze', 'Silver', 'Gold'))
);

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text
);

create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text unique not null,
  phone text,
  address text
);

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) on delete set null,
  total_amount numeric not null check (total_amount >= 0),
  status text default 'Pending'::text check (status in ('Pending', 'Processing', 'Completed', 'Cancelled')),
  points_earned integer default 0 not null
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric not null check (price_at_purchase >= 0)
);

-- Helper: role check
create or replace function public.get_auth_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, points, tier)
  values (new.id, new.raw_user_meta_data->>'full_name', 'Member', 0, 'Bronze');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Points & tier on order completion
create or replace function public.update_member_points_and_tier()
returns trigger as $$
declare
  calculated_points integer;
  total_user_points integer;
  new_tier text;
begin
  if new.status = 'Completed' and old.status is distinct from 'Completed' then
    calculated_points := floor(new.total_amount / 10000);

    update public.orders set points_earned = calculated_points where id = new.id;

    update public.profiles
    set points = points + calculated_points
    where id = new.user_id
    returning points into total_user_points;

    if total_user_points >= 500 then new_tier := 'Gold';
    elsif total_user_points >= 100 then new_tier := 'Silver';
    else new_tier := 'Bronze';
    end if;

    update public.profiles set tier = new_tier where id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_completed on public.orders;
create trigger on_order_completed
  after update of status on public.orders
  for each row execute procedure public.update_member_points_and_tier();

-- RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.get_auth_role() = 'Admin');

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id or public.get_auth_role() = 'Admin');

-- products
drop policy if exists "products_select" on public.products;
create policy "products_select" on public.products
  for select using (true);

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all using (public.get_auth_role() = 'Admin');

-- customers
drop policy if exists "customers_admin_all" on public.customers;
create policy "customers_admin_all" on public.customers
  for all using (public.get_auth_role() = 'Admin');

-- orders
drop policy if exists "orders_select" on public.orders;
create policy "orders_select" on public.orders
  for select using (auth.uid() = user_id or public.get_auth_role() = 'Admin');

drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "orders_update_delete" on public.orders;
create policy "orders_update_delete" on public.orders
  for update using (public.get_auth_role() = 'Admin');

drop policy if exists "orders_delete" on public.orders;
create policy "orders_delete" on public.orders
  for delete using (public.get_auth_role() = 'Admin');

-- order_items
drop policy if exists "order_items_select" on public.order_items;
create policy "order_items_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where id = order_id
      and (user_id = auth.uid() or public.get_auth_role() = 'Admin')
    )
  );

drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );
