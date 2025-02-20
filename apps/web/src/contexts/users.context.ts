import api from "@/services/api";
import { addSearchFilter } from "@/utils/add-search-filter-to-query";
import type { AxiosResponse } from "axios";
import type { User } from "@prisma/client";
import { create } from "zustand";

type State = {
  isLoading: boolean;
  pagination: Pagination;
  filter: string;
  users: User[];
  selectableUsers: SelectObject[];
};

type Actions = {
  setPagination: (pagination: Partial<Pagination>) => void;
  setFilter: (filter: string) => void;
  getUsers: (per?: number) => Promise<void>;
  getSelectableUsers: () => Promise<void>;
  addUser: (u: Partial<User>) => Promise<void>;
  updateUser: (id: number, u: Partial<User>) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
  addCredit: (store_id: number, credits: number) => Promise<void>;
  removeCredit: (store_id: number, credits: number) => Promise<void>;
};

export const useUsersContext = create<State & Actions>((set, get) => ({
  isLoading: false,
  pagination: {
    currentPage: 1,
    lastPage: 0,
    perPage: 5,
    total: 0,
    next: null,
    prev: null,
  },
  setPagination: (pagination: Partial<Pagination>) => {
    set((state) => ({ pagination: { ...state.pagination, ...pagination } }));
  },
  filter: "",
  setFilter: (filter: string) => {
    console.log(filter);
    set({ filter });
  },
  users: [],
  getUsers: async (store_id?: number, per?: number) => {
    set({ isLoading: true });
    const { currentPage, perPage } = get().pagination;
    if (per) {
      set({ pagination: { ...get().pagination, perPage: per } });
    }
    let res: AxiosResponse;

    res = await api.get(`user?page=${currentPage}&perPage=${perPage}${addSearchFilter(get().filter)}`);
    set({
      pagination: currentPage > res.data.meta.lastPage ? { ...res.data.meta, currentPage: 1 } : res.data.meta,
      users: res.data.data,
      isLoading: false,
    });
  },
  selectableUsers: [],
  getSelectableUsers: async () => {
    const res = await api.get("user/selectable");
    const selectables: SelectObject[] = [];
    for (const obj of res.data) {
      selectables.push({ value: obj.id, label: `${obj.username}` });
    }
    set({ selectableUsers: selectables });
  },
  addUser: async (u: Partial<User>) => {
    try {
      const res = await api.post("/user", {
        username: u.username,
        email: u.email,
        password: u.password,
        role: u.role,
      });
      set((state) => ({ users: [res.data, ...state.users] }));
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  updateUser: async (id: number, u: Partial<User>) => {
    console.log('aaaa')
    try {
      const res = await api.patch(`/user/${id}`, {
        username: u.username,
        email: u.email,
        password: u.password,
        role: u.role,
      });
      console.log(res.data);
      set((state) => ({
        users: state.users.map((oldData) => (oldData.id === u.id ? res.data : oldData)),
      }));
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  removeUser: async (id: number) => {
    try {
      await api.delete(`/user/${id}`);
      set({
        users: get().users.filter((oldData) => oldData.id !== id),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  addCredit: async (user_id: number, credits: number) => {
    try {
      await api.post("/wallet/add-credit", {
        user_id,
        credits,
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  removeCredit: async (user_id: number, credits: number) => {
    try {
      await api.post("/wallet/remove-credit", {
        user_id,
        credits,
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
}));
