import { create } from 'zustand';
import { Label } from './label.entity';

interface LabelStore {
  labels: Label[];
}

export const useLabelStore = create<LabelStore>(() => ({
  labels: [],
}));
