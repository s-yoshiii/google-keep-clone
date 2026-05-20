import { supabase } from '../../lib/supabase';
import { Note } from './note.entity';
import { Label } from '../labels/label.entity';
export interface SaveNoteParams {
  title?: string;
  content?: string;
  labelIds: string[];
  imageFile?: File;
}
export interface NotesResponse {
  notes: Note[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const noteRepository = {
  async createNote(params: SaveNoteParams): Promise<Note> {
    let imageUrl: string | undefined;
    if (params.imageFile) {
      imageUrl = await uploadImage(params.imageFile);
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session!.user.id;
    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: params.title,
        content: params.content,
        image_url: imageUrl,
        user_id: userId,
      })
      .select('*, labels(*)')
      .single();
    if (error) throw error;

    if (params.labelIds.length > 0) {
      await supabase.from('note_labels').insert(
        params.labelIds.map((labelId) => ({
          note_id: data.id,
          label_id: labelId,
        }))
      );
    }
    return new Note(toNote(data));
  },
  async getNotes(
    page: number = 1,
    limit: number = 3,
    query?: string
  ): Promise<NotesResponse> {
    let q = supabase
      .from('notes')
      .select('*, labels(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (query) {
      q = q.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }

    const { data, count, error } = await q;
    if (error) throw error;

    const totalPages = Math.ceil((count ?? 0) / limit);
    return {
      notes: data.map((n) => new Note(toNote(n))),
      pagination: { total: count ?? 0, page, limit, totalPages },
    };
  },
  async updateNote(id: string, params: SaveNoteParams): Promise<Note> {
    let imageUrl: string | undefined;
    if (params.imageFile) {
      imageUrl = await uploadImage(params.imageFile);
    }
    const { data, error } = await supabase
      .from('notes')
      .update({
        title: params.title,
        content: params.content,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, labels(*)')
      .single();
    if (error) throw error;
    await supabase.from('note_labels').delete().eq('note_id', id);
    if (params.labelIds.length > 0) {
      await supabase.from('note_labels').insert(
        params.labelIds.map((labelId) => ({
          note_id: data.id,
          label_id: labelId,
        }))
      );
    }
    return new Note(toNote(data));
  },
  async deleteNote(id: string): Promise<void> {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
  },
};

async function uploadImage(file: File): Promise<string> {
  const filename = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from('images')
    .upload(filename, file);
  if (error) throw error;
  const { data } = supabase.storage.from('images').getPublicUrl(filename);
  return data.publicUrl;
}

function toLabel(raw: Record<string, unknown>): Label {
  return {
    id: raw.id,
    userId: raw.user_id,
    name: raw.name,
    color: raw.color,
  } as Label;
}

function toNote(raw: Record<string, unknown>): Note {
  return {
    id: raw.id,
    userId: raw.user_id,
    title: raw.title,
    content: raw.content,
    imageUrl: raw.image_url,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    labels: ((raw.labels as Record<string, unknown>[]) ?? []).map(toLabel),
  } as Note;
}
