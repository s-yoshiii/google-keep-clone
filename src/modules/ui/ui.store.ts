import { create } from "zustand";

export interface FlashMessage {
    message: string;
    type: FlashMessageType;
}

type FlashMessageType = 'success' | 'error';

interface UIStore {
    flashMessage: FlashMessage | null;
    addFlashMessage:(message:string,type:FlashMessageType) => void;
    removeFlashMessage: () => void;
}

export const userUIStore = create<UIStore>((set) =>({
    flashMessage: null,
    addFlashMessage: (message:string,type:FlashMessageType) => {
        set({ flashMessage: { message, type } });
    },
    removeFlashMessage: () => {
        set({ flashMessage: null });
    }
}));