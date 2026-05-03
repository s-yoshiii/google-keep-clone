import { create } from 'zustand';
import { Label } from './label.entity';

interface LabelStore {
  labels: Label[];
  addLabel: (label: Label) => void;
  setLabels: (labels: Label[]) => void;
  removeLabel: (id: string) => void;
}

export const useLabelStore = create<LabelStore>((set) => ({
  labels: [],
  addLabel: (label: Label) => {
    set((state) => ({ labels: [...state.labels, label] }));
  },
  setLabels: (labels: Label[]) => {
    set({ labels });
  },
  removeLabel: (id: string) => {
    set((state) => ({
      labels: state.labels.filter((label) => label.id !== id),
    }));
  },
}));
