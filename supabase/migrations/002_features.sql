-- Fitur tambahan: Inventory, POS, Chatbox, Resep, Promo, Artikel, Testimoni

-- Riwayat pergerakan stok
create table if not exists public.inventory_movements (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references public.products(id) on delete cascade not null,
  movement_type text not null check (movement_type in ('in', 'out', 'adjustment', 'pos_sale')),
  quantity integer not null check (quantity > 0),
  notes text,
  created_by uuid references public.profiles(id) on delete set null
);

-- Resep obat (upload & riwayat)
create table if not exists public.prescriptions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  doctor_name text,
  notes text,
  image_url text,
  status text default 'Pending'::text check (status in ('Pending', 'Approved', 'Rejected', 'Fulfilled'))
);

-- Chatbox
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  is_read boolean default false not null
);

-- Broadcast Promo
create table if not exists public.promos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  discount_percent integer default 0 check (discount_percent >= 0 and discount_percent <= 100),
  is_active boolean default true not null,
  valid_until timestamp with time zone
);

-- Artikel Kesehatan
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  author text,
  image_url text,
  is_published boolean default true not null
);

-- Testimoni
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  is_approved boolean default false not null
);

-- Trigger: kurangi stok saat POS sale
create or replace function public.adjust_stock_on_movement()
returns trigger as $$
begin
  if new.movement_type in ('out', 'pos_sale') then
    update public.products set stock = stock - new.quantity where id = new.product_id;
  elsif new.movement_type = 'in' then
    update public.products set stock = stock + new.quantity where id = new.product_id;
  elsif new.movement_type = 'adjustment' then
    update public.products set stock = new.quantity where id = new.product_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_inventory_movement on public.inventory_movements;
create trigger on_inventory_movement
  after insert on public.inventory_movements
  for each row execute procedure public.adjust_stock_on_movement();

-- RLS
alter table public.inventory_movements enable row level security;
alter table public.prescriptions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.promos enable row level security;
alter table public.articles enable row level security;
alter table public.testimonials enable row level security;

-- inventory_movements: admin only
drop policy if exists "inventory_admin_all" on public.inventory_movements;
create policy "inventory_admin_all" on public.inventory_movements
  for all using (public.get_auth_role() = 'Admin');

-- prescriptions
drop policy if exists "prescriptions_select" on public.prescriptions;
create policy "prescriptions_select" on public.prescriptions
  for select using (auth.uid() = user_id or public.get_auth_role() = 'Admin');

drop policy if exists "prescriptions_insert" on public.prescriptions;
create policy "prescriptions_insert" on public.prescriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "prescriptions_update" on public.prescriptions;
create policy "prescriptions_update" on public.prescriptions
  for update using (public.get_auth_role() = 'Admin');

-- chat_messages
drop policy if exists "chat_select" on public.chat_messages;
create policy "chat_select" on public.chat_messages
  for select using (auth.uid() is not null);

drop policy if exists "chat_insert" on public.chat_messages;
create policy "chat_insert" on public.chat_messages
  for insert with check (auth.uid() = sender_id);

drop policy if exists "chat_update" on public.chat_messages;
create policy "chat_update" on public.chat_messages
  for update using (auth.uid() is not null);

-- promos
drop policy if exists "promos_select" on public.promos;
create policy "promos_select" on public.promos
  for select using (true);

drop policy if exists "promos_admin_all" on public.promos;
create policy "promos_admin_all" on public.promos
  for all using (public.get_auth_role() = 'Admin');

-- articles
drop policy if exists "articles_select" on public.articles;
create policy "articles_select" on public.articles
  for select using (is_published = true or public.get_auth_role() = 'Admin');

drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all" on public.articles
  for all using (public.get_auth_role() = 'Admin');

-- testimonials
drop policy if exists "testimonials_select" on public.testimonials;
create policy "testimonials_select" on public.testimonials
  for select using (is_approved = true or auth.uid() = user_id or public.get_auth_role() = 'Admin');

drop policy if exists "testimonials_insert" on public.testimonials;
create policy "testimonials_insert" on public.testimonials
  for insert with check (auth.uid() = user_id);

drop policy if exists "testimonials_update" on public.testimonials;
create policy "testimonials_update" on public.testimonials
  for update using (public.get_auth_role() = 'Admin');
