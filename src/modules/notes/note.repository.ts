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
    const formData = new FormData();
    if (params.title) formData.append('title', params.title);
    if (params.content) formData.append('content', params.content);
    if (params.labelIds && params.labelIds.length > 0)
      formData.append('labelIds', JSON.stringify(params.labelIds));
    if (params.imageFile) formData.append('image', params.imageFile);
    const result = await api.post('/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return new Note(result.data);
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
    const formData = new FormData();
    if (params.title) formData.append('title', params.title);
    if (params.content) formData.append('content', params.content);
    if (params.labelIds && params.labelIds.length > 0)
      formData.append('labelIds', JSON.stringify(params.labelIds));
    if (params.imageFile) formData.append('image', params.imageFile);
    const result = await api.put(`/notes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return new Note(result.data);
  },
  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
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
