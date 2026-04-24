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
let flashMessageTimer: number | null = null;

export const userUIStore = create<UIStore>((set) =>({
    flashMessage: null,
    addFlashMessage: (message:string,type:FlashMessageType) => {
        set({ flashMessage: { message, type } });
        flashMessageTimer = setTimeout(() => {
            set({ flashMessage: null });
            flashMessageTimer = null
        }, 3000);
    },
    removeFlashMessage: () => {
        if(flashMessageTimer) {
            clearTimeout(flashMessageTimer);
            flashMessageTimer = null;
        }
        set({ flashMessage: null });
    }
}));