import { create } from "zustand";
import type { User } from "../users/user.entity";

interface CurrentUserStore {
    currentUser: User | null,
    setCurrentUser: (user: User | null) => void,
}
export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
    currentUser: null,
    setCurrentUser:(user) => set({ currentUser:user }),
}));