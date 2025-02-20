import api from "@/services/api";
import { addSearchFilter } from "@/utils/add-search-filter-to-query";
import { AxiosResponse } from "axios";
import type { Order } from "@prisma/client";
import { create } from "zustand";

type ShipOrder = {
  future: boolean;
  future_store_id?: number;
};

type State = {
  isLoading: boolean;
  pagination: Pagination;
  filter: string;
  orders: Order[];
  selectableOrders: SelectObject[];
};

type Actions = {
  setPagination: (pagination: Partial<Pagination>) => void;
  setFilter: (filter: string) => void;
  getOrders: (store_id?: number, per?: number) => Promise<void>;
  getSelectableOrders: () => Promise<void>;
  updateOrder: (id: number, s: Partial<Order>) => Promise<void>;
  acceptOrder: (id: number) => Promise<void>;
  undoAcceptOrder: (id: number) => Promise<void>;
  shipOrder: (id: number, data: ShipOrder) => Promise<void>;
  undoShipOrder: (id: number) => Promise<void>;
  doneOrder: (id: number) => Promise<void>;
  undoDoneOrder: (id: number) => Promise<void>;
};

export const useOrdersContext = create<State & Actions>((set, get) => ({
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
    set({ filter });
  },
  orders: [],
  getOrders: async (store_id?: number, per?: number) => {
    set({ isLoading: true });
    const { currentPage, perPage } = get().pagination;
    if (per) {
      set({ pagination: { ...get().pagination, perPage: per } });
    }
    let res: AxiosResponse;

    if (store_id) {
      res = await api.get(
        `order/store/${store_id}?page=${currentPage}&perPage=${perPage}${addSearchFilter(get().filter)}`
      );
    } else {
      res = await api.get(`order?page=${currentPage}&perPage=${perPage}${addSearchFilter(get().filter)}`);
    }
    set({
      pagination: currentPage > res.data.meta.lastPage ? { ...res.data.meta, currentPage: 1 } : res.data.meta,
      orders: res.data.data,
      isLoading: false,
    });
  },
  selectableOrders: [],
  getSelectableOrders: async () => {
    const res = await api.get("order/selectable");
    const selectables: SelectObject[] = [];
    for (const obj of res.data) {
      selectables.push({ value: obj.id, label: obj.name });
    }
    set({ selectableOrders: selectables });
  },
  updateOrder: async (id, s) => {
    try {
      const res = await api.patch(`/order/${id}`, {
        ...s,
      });
      set({
        orders: get().orders.map((oldData) => (oldData.id === id ? res.data : oldData)),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  acceptOrder: async (id) => {
    try {
      const res = await api.post(`/order/accept/${id}`);
      console.log(res.data);
      set({
        orders: get().orders.map((oldData) => (oldData.id === id ? res.data : oldData)),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  undoAcceptOrder: async (id) => {
    try {
      const res = await api.post(`/order/undo-accept/${id}`);
      console.log(res.data);
      set({
        orders: get().orders.map((oldData) => (oldData.id === id ? res.data : oldData)),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  shipOrder: async (id, data) => {
    try {
      const res = await api.post(`/order/ship/${id}`, data);
      console.log(res.data);
      set({
        orders: get().orders.map((oldData) => (oldData.id === id ? res.data : oldData)),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  undoShipOrder: async (id) => {
    try {
      const res = await api.post(`/order/undo-ship/${id}`);
      console.log(res.data);
      set({
        orders: get().orders.map((oldData) => (oldData.id === id ? res.data : oldData)),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  doneOrder: async (id) => {
    try {
      const res = await api.post(`/order/done/${id}`);
      console.log(res.data);
      set({
        orders: get().orders.map((oldData) => (oldData.id === id ? res.data : oldData)),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  undoDoneOrder: async (id) => {
    try {
      const res = await api.post(`/order/undo-done/${id}`);
      console.log(res.data);
      set({
        orders: get().orders.map((oldData) => (oldData.id === id ? res.data : oldData)),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
}));
