import { create } from 'zustand';
import type { Note } from './note.entity';

interface NoteStore {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Note) => void;
  setNotes: (notes: Note[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  isLoading: false,
  addNote: (note: Note) => {
    set((state) => ({ notes: [note, ...state.notes] }));
  },
  setNotes(notes: Note[]) {
    set({ notes });
  },
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
