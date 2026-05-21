import { supabase } from '../../lib/supabase';
import { Label } from './label.entity';

export const labelRepository = {
  async createLabel(name: string, color: string): Promise<Label> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session!.user.id;
    const { data, error } = await supabase
      .from('labels')
      .insert({ name, color, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return new Label(toLabel(data));
  },
  async getLabels(): Promise<Label[]> {
    const { data, error } = await supabase.from('labels').select('*');
    if (error) throw error;
    return data.map((l) => new Label(toLabel(l)));
  },
  async deleteLabel(id: string): Promise<void> {
    const { error } = await supabase.from('labels').delete().eq('id', id);
    if (error) throw error;
  },
};

function toLabel(raw: Record<string, unknown>): Label {
  return {
    id: raw.id,
    userId: raw.user_id,
    name: raw.name,
    color: raw.color,
  } as Label;
}
