import api from "@/services/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Role = "ADMIN" | "MANAGER" | "CUSTOMER";
export interface UserAuthProps {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
}

type State = {
  user: UserAuthProps | null;
  isLoading: boolean;
};

type Actions = {
  setUser: (user: UserAuthProps | null) => void;
  decodeToken: (token: string | null) => Promise<UserAuthProps | undefined>;
  logOut: () => void;
};

export const useAuthContext = create(
  persist<State & Actions>(
    (set, get) => ({
      isLoading: false,
      user: null,
      setUser: (user: UserAuthProps | null) => {
        set({ user });
      },
      decodeToken: async (token: string | null) => {
        set({ isLoading: true });
        try {
          const res = await api.post("/auth/decode", { token: token });
          const user = {
            id: res.data.sub,
            email: res.data.email,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            role: res.data.role,
          };
          set({ user });

          return user;
        } catch (ex: unknown) {
          get().logOut();
        } finally {
          set({ isLoading: false });
        }
      },
      logOut: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        localStorage.removeItem("store");
        set({ user: null });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
