import { create } from 'zustand';
import { Label } from './label.entity';

interface LabelStore {
  labels: Label[];
  addLabel: (label: Label) => void;
}

export const useLabelStore = create<LabelStore>((set) => ({
  labels: [],
  addLabel: (label: Label) => {
    set((state) => ({ labels: [...state.labels, label] }));
  },
}));
