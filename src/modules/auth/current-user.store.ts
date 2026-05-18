import { create } from 'zustand';
import type { User } from '../users/user.entity';
import { supabase } from '../../lib/supabase';

interface CurrentUserStore {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  initAuth: () => void;
}

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  initAuth: () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        set({
          currentUser: { id: u.id, name: u.user_metadata.name, email: u.email! } as User,
        });
      } else {
        set({ currentUser: null });
      }
    });
  },
}));
