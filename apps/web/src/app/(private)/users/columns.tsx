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
import { useUsersContext } from "@/contexts/users.context";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import FormUtil from "./form";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          E-mail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "walletBalance",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Saldo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Gasto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role");
      if (role === "ADMIN") {
        return "Administrador";
      }

      if (role === "MANAGER") {
        return "Gerente";
      }

      if (role === "CUSTOMER") {
        return "Cliente";
      }

      return "error";
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "Ações",
    cell: ({ row }) => {
      const { removeUser } = useUsersContext();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col items-start gap-4">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <FormUtil
              name="Editar"
              description="Edite este usuario"
              defaultValues={{
                username: row.original.username,
                email: row.original.email,
                role: row.original.role,
              }}
              type="update"
              id={row.original.id}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-red-500">Excluir</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Excluir usuario "{row.original.username}"
                  </DialogTitle>
                  <DialogDescription>Quer mesmo excluir este usuario?</DialogDescription>
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
                          removeUser(row.original.id);
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
