-- =============================================================
-- SETUP TABEL: orders + order_items
-- Untuk transaksi yang dibuat dari aplikasi (KeranjangObat/MyOrders)
-- Jalankan SETELAH: setup_users_and_profiles.sql + setup_inventory_movements.sql
-- =============================================================


-- -------------------------------------------------------------
-- BAGIAN 1: TABEL orders
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status        TEXT        NOT NULL DEFAULT 'Pending'
                            CHECK (status IN ('Pending', 'Processing', 'Completed', 'Cancelled')),
  total_amount  BIGINT      NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  points_earned INTEGER     NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.orders IS 'Pesanan dari member via KeranjangObat / MyOrders';

-- Auto update updated_at
DROP TRIGGER IF EXISTS orders_set_updated_at ON public.orders;
CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Otomatis hitung points_earned saat status berubah ke Completed (1 poin per 10.000)
CREATE OR REPLACE FUNCTION public.handle_order_completed()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'Completed' AND OLD.status <> 'Completed' THEN
    NEW.points_earned := FLOOR(NEW.total_amount / 10000);

    -- Tambahkan poin ke profil member
    UPDATE public.profiles
    SET
      points = points + NEW.points_earned,
      tier   = CASE
                 WHEN points + NEW.points_earned >= 1000 THEN 'Gold'
                 WHEN points + NEW.points_earned >= 500  THEN 'Silver'
                 ELSE 'Bronze'
               END
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_completed ON public.orders;
CREATE TRIGGER on_order_completed
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_completed();

-- Index
CREATE INDEX IF NOT EXISTS idx_orders_user_id   ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status    ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created   ON public.orders(created_at DESC);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Member can view own orders"   ON public.orders;
DROP POLICY IF EXISTS "Member can insert orders"     ON public.orders;
DROP POLICY IF EXISTS "Admin can view all orders"    ON public.orders;
DROP POLICY IF EXISTS "Admin can update order status" ON public.orders;
DROP POLICY IF EXISTS "Admin can delete orders"      ON public.orders;

CREATE POLICY "Member can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Member can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.get_my_role() IN ('Admin', 'Member'));

CREATE POLICY "Admin can view all orders"
  ON public.orders FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can update order status"
  ON public.orders FOR UPDATE
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete orders"
  ON public.orders FOR DELETE
  USING (public.get_my_role() = 'Admin');


-- -------------------------------------------------------------
-- BAGIAN 2: TABEL order_items
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID    NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID    NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price BIGINT  NOT NULL CHECK (unit_price >= 0),
  subtotal   BIGINT  GENERATED ALWAYS AS (quantity * unit_price) STORED
);

COMMENT ON TABLE public.order_items IS 'Detail item dalam setiap pesanan';

-- Index
CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Member can view own order items"  ON public.order_items;
DROP POLICY IF EXISTS "Member can insert order items"    ON public.order_items;
DROP POLICY IF EXISTS "Admin can view all order items"   ON public.order_items;
DROP POLICY IF EXISTS "Admin can delete order items"     ON public.order_items;

CREATE POLICY "Member can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Member can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all order items"
  ON public.order_items FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete order items"
  ON public.order_items FOR DELETE
  USING (public.get_my_role() = 'Admin');


-- -------------------------------------------------------------
-- Verifikasi
-- -------------------------------------------------------------
SELECT table_name, 'OK' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('orders', 'order_items')
ORDER BY table_name;
