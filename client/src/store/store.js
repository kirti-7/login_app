import { create } from 'zustand';


// custom hooks
export const useAuthStore = create((set) => ({
    auth: {
        username:'',
        active: false,
    },
    setUsername: (name) => set((state) => ({ auth: { ...state.auth, username: name } })),
}))
