import { create } from 'zustand';
import type { Note } from './note.entity';

interface NoteStore {
  notes: Note[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  addNote: (note: Note) => void;
  setNotes: (notes: Note[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  removeLabelFromNotes: (labelId: string) => void;
  replaceNote: (id: string, newValue: Note) => void;
  removeNote: (id: string) => void;
  addNotes: (notes: Note[]) => void;
  resetNotes: () => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  isLoading: false,
  page: 1,
  hasMore: true,
  addNote: (note: Note) => {
    set((state) => ({ notes: [note, ...state.notes] }));
  },
  setNotes(notes: Note[]) {
    set({ notes });
  },
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
  removeLabelFromNotes: (labelId: string) => {
    set((state) => ({
      notes: state.notes.map((note) => ({
        ...note,
        labels: note.labels?.filter((label) => label.id !== labelId) || [],
      })),
    }));
  },
  replaceNote(id: string, newValue: Note) {
    set((state) => ({
      notes: state.notes.map((note) => (note.id === id ? newValue : note)),
    }));
  },
  removeNote: (id: string) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },
  addNotes: (notes: Note[]) => {
    set((state) => ({ notes: [...state.notes, ...notes] }));
  },
  resetNotes: () => {
    set({ notes: [], page: 1, hasMore: true });
  },
  setPage: (page: number) => {
    set({ page });
  },
  setHasMore: (hasMore: boolean) => {
    set({ hasMore });
  },
}));
