-- =============================================================
-- SETUP TABEL: chat_messages
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message    TEXT        NOT NULL,
  is_read    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.chat_messages IS 'Pesan chat antara member dan apoteker/admin';

-- Index untuk performa (query order by created_at)
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender    ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created   ON public.chat_messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read   ON public.chat_messages(is_read);

-- RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin can mark messages read"          ON public.chat_messages;

-- Semua user yang login bisa baca semua pesan (chatbox bersama)
CREATE POLICY "Authenticated users can view messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Semua user yang login bisa kirim pesan
CREATE POLICY "Authenticated users can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Admin bisa update is_read
CREATE POLICY "Admin can mark messages read"
  ON public.chat_messages FOR UPDATE
  USING (public.get_my_role() = 'Admin');

-- Realtime subscription (opsional — aktifkan jika mau auto-refresh tanpa polling)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Verifikasi
SELECT 'chat_messages created' AS status;
