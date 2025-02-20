"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInventoryContext } from "@/contexts/inventory.context";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import FormUtil from "./form";
import { intToBrl } from "@/utils/currency";
import type { Prisma } from "@prisma/client";

type ProductWithFiles = Prisma.ProductGetPayload<{
  include: {
    files: true;
  };
}>;

export const columns: ColumnDef<ProductWithFiles>[] = [
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Slug
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Preço
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Estoque
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ativo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "Ações",
    cell: ({ row }) => {
      const { removeProduct } = useInventoryContext();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col items-start">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant={"ghost"}>Detalhes</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Detalhes do produto "{row.original.name}"
                  </DialogTitle>
                </DialogHeader>

                <p>SKU: {row.original.sku}</p>
                <p>Preço: {intToBrl(row.original.price)}</p>
                <p>Estoque: {row.original.stock}</p>
                <p>Ativo: {row.original.active ? "Sim" : "Não"}</p>
                <p>Slug: {row.original.files && row.original.files[0] && row.original.files[0].url}</p>
              </DialogContent>
              
            </Dialog>
            <FormUtil
              name="Editar"
              description="Edite este produto"
              defaultValues={{
                
              }}
              type="update"
              id={row.original.id}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-red-500 hover:text-red-600 hover:bg-red-100" variant={"ghost"}>Excluir</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Excluir produto "{row.original.name}"
                  </DialogTitle>
                  <DialogDescription>Quer mesmo excluir este produto?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white ml-2"
                      onClick={() => {
                        try {
                          removeProduct(row.original.id);
                        } catch (ex) {
                          console.log(ex);
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
