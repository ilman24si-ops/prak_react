import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, points, tier, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[AuthContext] fetchProfile gagal:', error.message, error.code, error.details);

      // Coba fallback: baca role dari JWT metadata jika ada
      const { data: { user } } = await supabase.auth.getUser();
      const metaRole = user?.user_metadata?.role;

      const fallback = {
        id: userId,
        full_name: user?.user_metadata?.full_name ?? user?.email ?? 'User',
        role: metaRole ?? 'Guest',
        points: 0,
        tier: 'Bronze',
        isFallback: true,
        fetchError: error.message,
      };
      setProfile(fallback);
      return fallback;
    }

    setProfile(data);
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return null;
    return fetchProfile(userId);
  }, [fetchProfile, session?.user?.id]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user?.id) {
        await fetchProfile(data.session.user.id);
      }
      setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user?.id) {
          await fetchProfile(nextSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      loading,
      refreshProfile,
      signOut,
      isAuthenticated: !!session,
      isAdmin: profile?.role === 'Admin',
      isMember: profile?.role === 'Member',
      isGuest: profile?.role === 'Guest',
    }),
    [session, profile, loading, refreshProfile, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
