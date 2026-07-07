import { supabase } from './supabaseClient';

export const login = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user, error };
};

export const register = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user, error };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUser = () => {
  return supabase.auth.user();
};