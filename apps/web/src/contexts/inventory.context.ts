import api from "@/services/api";
import { addSearchFilter } from "@/utils/add-search-filter-to-query";
import type { AxiosResponse } from "axios";
import type { Prisma} from "@prisma/client";
import { create } from "zustand";

type ProductWithFiles = Prisma.ProductGetPayload<{
  include: {
    files: true; // Include the `files` relation
  };
}>;


type State = {
  isLoading: boolean;
  pagination: Pagination;
  filter: string;
  products: ProductWithFiles[]
};

type Actions = {
  setPagination: (pagination: Partial<Pagination>) => void;
  setFilter: (filter: string) => void;
  getProducts: (per?: number) => Promise<void>;
  addProduct: (u: Partial<ProductWithFiles>) => Promise<void>;
  updateProduct: (id: number, u: Partial<ProductWithFiles>) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
};

export const useInventoryContext = create<State & Actions>((set, get) => ({
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
  addProduct: async (u: Partial<ProductWithFiles>) => {
    try {
      const res = await api.post("/product", {
        sku: u.sku,
        name: u.name,
        description: u.description,
        imageUrl: u.imageUrl,
        price: u.price,
        stock: u.stock,
        active: u.active
      });
      set((state) => ({ products: [res.data, ...state.products] }));
    } catch (ex: unknown) {
      throw new Error(ex as string);
    }
  },
  updateProduct: async (id: number, u: Partial<ProductWithFiles>) => {
    console.log('aaaa')
    try {
      const res = await api.patch(`/product/${id}`, {
        sku: u.sku,
        name: u.name,
        description: u.description,
        imageUrl: u.imageUrl,
        price: u.price,
        stock: u.stock,
        active: u.active
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
