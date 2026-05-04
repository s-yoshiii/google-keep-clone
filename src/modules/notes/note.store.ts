import { create } from 'zustand';
import type { Note } from './note.entity';

interface NoteStore {
  notes: Note[];
  addNote: (note: Note) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  addNote: (note: Note) => {
    set((state) => ({ notes: [note, ...state.notes] }));
  },
}));
