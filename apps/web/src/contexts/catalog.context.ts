import api from "@/services/api";
import { addSearchFilter } from "@/utils/add-search-filter-to-query";
import type { AxiosResponse } from "axios";
import type { Product } from "@prisma/client";
import { create } from "zustand";

type State = {
  isLoading: boolean;
  pagination: Pagination;
  filter: string;
  products: Product[];
};

type Actions = {
  setPagination: (pagination: Partial<Pagination>) => void;
  setFilter: (filter: string) => void;
  getProducts: (per?: number) => Promise<void>;
  addProduct: (u: Partial<Product>) => Promise<void>;
  updateProduct: (id: number, u: Partial<Product>) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
};

export const useCatalogContext = create<State & Actions>((set, get) => ({
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
  products: [],
  getProducts: async (per?: number) => {
    set({ isLoading: true });
    const { currentPage, perPage } = get().pagination;
    if (per) {
      set({ pagination: { ...get().pagination, perPage: per } });
    }
    let res: AxiosResponse;
    res = await api.get(`product?page=${currentPage}&perPage=${perPage}${addSearchFilter(get().filter)}`);
    set({
      pagination: currentPage > res.data.meta.lastPage ? { ...res.data.meta, currentPage: 1 } : res.data.meta,
      products: res.data.data,
      isLoading: false,
    });
  },
  addProduct: async (u: Partial<Product>) => {
    try {
      const res = await api.post("/product", {
        name: u.name,
        description: u.description,
        imageUrl: u.imageUrl,
        price: u.price,
        stock: u.stock
      });
      set((state) => ({ products: [res.data, ...state.products] }));
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  updateProduct: async (id: number, u: Partial<Product>) => {
    console.log('aaaa')
    try {
      const res = await api.patch(`/product/${id}`, {
        name: u.name,
        description: u.description,
        imageUrl: u.imageUrl,
        price: u.price,
        stock: u.stock
      });
      console.log(res.data);
      set((state) => ({
        products: state.products.map((oldData) => (oldData.id === u.id ? res.data : oldData)),
      }));
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  removeProduct: async (id: number) => {
    try {
      await api.delete(`/product/${id}`);
      set({
        products: get().products.filter((oldData) => oldData.id !== id),
      });
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
}));
