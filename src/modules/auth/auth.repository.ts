import { supabase } from '../../lib/supabase';
import { User } from '../users/user.entity';

export const authRepository = {
  async signup(name: string, email: string, password: string): Promise<{ user: User }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    await supabase.from('profiles').insert({ id: data.user!.id, name });
    return { user: new User({ id: data.user!.id, name, email }) };
  },

  async signin(email: string, password: string): Promise<{ user: User }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const u = data.user;
    return { user: new User({ id: u.id, name: u.user_metadata.name, email: u.email! }) };
  },

  async signout(): Promise<void> {
    await supabase.auth.signOut();
  },
};
