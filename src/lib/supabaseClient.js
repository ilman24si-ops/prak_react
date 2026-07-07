import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(url) {
  if (!url) return url;
  return url
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. '
      + 'Auth/CRUD will fail until env vars are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Uncomment untuk debug koneksi:
// (async () => {
//   const { data, error } = await supabase.from('profiles').select('count').limit(1);
//   console.log('[supabaseClient] test query:', { data, error });
// })();
