import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ user: userData });
    } catch (error) {
      throw error;
    }
  },

  register: async (email: string, username: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user?.id,
        email,
        username,
        avatar_url: `https://ui-avatars.com/api/?name=${username}&background=random`,
      });

      if (profileError) throw profileError;

      set({
        user: {
          id: authData.user!.id,
          email,
          username,
          avatar_url: `https://ui-avatars.com/api/?name=${username}&background=random`,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        set({ user: userData });
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
