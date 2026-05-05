'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type UserRole = 'user' | 'admin' | 'manager' | 'support';
type UserStatus = 'active' | 'suspended';

interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  permis_picture?: string | null;
  permis_verified?: boolean | null;
  created_at: string;
}

interface AuthContextType {
  user: AppUser | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; role?: UserRole; error?: string }>;
  register: (payload: { name: string; email: string; phone: string; password: string }) => Promise<{ ok: boolean; role?: UserRole; error?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => ({ ok: false, error: 'Auth not ready' }),
  register: async () => ({ ok: false, error: 'Auth not ready' }),
  logout: async () => {},
  refreshProfile: async () => {},
});

async function fetchProfile(supabaseUser: SupabaseUser): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  // If the profile row doesn't exist yet (or fetching it fails), keep the app usable:
  // fall back to auth user metadata instead of treating the user as logged out.
  if (error || !data) {
    const meta = (supabaseUser.user_metadata ?? {}) as Record<string, unknown>;
    const name = typeof meta.name === 'string' ? meta.name : '';
    const phone = typeof meta.phone === 'string' ? meta.phone : '';

    return {
      id: supabaseUser.id,
      name,
      email: supabaseUser.email ?? '',
      phone,
      role: 'user',
      status: 'active',
      permis_picture: null,
      permis_verified: false,
      created_at: new Date().toISOString(),
    };
  }

  return {
    id: data.id,
    name: data.name ?? '',
    email: data.email ?? supabaseUser.email ?? '',
    phone: data.phone ?? '',
    role: data.role ?? 'user',
    status: data.status ?? 'active',
    avatar_url: data.avatar_url,
    permis_picture: data.permis_picture,
    permis_verified: data.permis_verified ?? false,
    created_at: data.created_at,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount and listen for auth changes
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user);
          if (mounted) setUser(profile);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user);
          if (mounted) setUser(profile);
        } else {
          if (mounted) setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user);
        if (profile) {
          setUser(profile);
          return { ok: true, role: profile.role };
        }
        return { ok: false, error: 'Profile not found. Please contact support.' };
      }

      return { ok: false, error: 'Unable to sign in.' };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Unable to sign in.' };
    }
  };

  const register = async (payload: { name: string; email: string; phone: string; password: string }) => {
    const name = payload.name.trim();
    const email = payload.email.trim();
    const phone = payload.phone.trim();
    const password = payload.password;

    if (!name || !email || !phone || !password) {
      return { ok: false, error: 'Please fill all required fields.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
        },
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      if (data.user) {
        // If session is null, email confirmation is required
        if (!data.session) {
          return { ok: true, requiresEmailConfirmation: true };
        }

        // Wait a short moment for the trigger to create the profile
        await new Promise((resolve) => setTimeout(resolve, 500));
        const profile = await fetchProfile(data.user);
        if (profile) {
          setUser(profile);
          return { ok: true, role: profile.role };
        }
        // Trigger may not have fired yet, create profile manually as fallback
        setUser({
          id: data.user.id,
          name,
          email,
          phone,
          role: 'user',
          status: 'active',
          permis_picture: null,
          permis_verified: false,
          created_at: new Date().toISOString(),
        });
        return { ok: true, role: 'user' as UserRole };
      }

      return { ok: false, error: 'Unable to create account.' };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Unable to create account.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
