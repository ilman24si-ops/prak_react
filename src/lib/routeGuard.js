import { useEffect } from 'react';

export function useAuthGuard({ supabase, onAuthed, onNotAuthed }) {
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (data?.session) onAuthed?.(data.session);
      else onNotAuthed?.();
    })();

    return () => {
      mounted = false;
    };
  }, [onAuthed, onNotAuthed, supabase]);
}

