import api from '../../lib/api';
import { Note } from './note.entity';
export interface SaveNoteParams {
  title?: string;
  content?: string;
  labelIds: string[];
  imageFile?: File;
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
};
