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
import type { ColumnDef } from "@tanstack/react-table";
import type { Prisma } from "@prisma/client";
import { ArrowUpDown, Clock, FileText, Mail, MoreHorizontal, User } from "lucide-react";
import FormUtil from "./form";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/contexts/auth.context";

type OrderWithCretiveAndDesigners = Prisma.OrderGetPayload<{
  include: {
    user: true;
    creative: {
      include: {
        designer: true;
      }
    }
  };
}>;

export const columns: ColumnDef<OrderWithCretiveAndDesigners>[] = [
  {
    accessorKey: "info",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Copy
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-sm mx-auto text-center">
          <div className="flex flex-col items-center gap-2">
           <div className="flex gap-2">
           <Badge variant="outline">{row.original.type}</Badge>
           <Badge variant="secondary">{row.original.niche}</Badge>
           </div>
            <p className="text-sm">{row.original.copy}</p>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "details",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Detalhes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span>{row.original.user.username}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <span>{row.original.user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
          </div>
          {row.original.reference && (
            <div className="flex items-center gap-2 text-sm text-blue-500">
              <Button variant={"link"} className="p-0" asChild>
                <a href={row.original.reference} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" />
                  <span>Referência</span>
                </a>
              </Button>
            </div>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "process",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Processo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <Badge variant={row.original.status === "PENDING" ? "secondary" : "default"} className="w-24 justify-center">
            {row.original.status}
          </Badge>
          <div>
            
          </div>
        </div>
      )
    }
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 font-medium">
          {row.original.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>)
    }
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "Ações",
    cell: ({ row }) => {
      const { user } = useAuthContext()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col items-start gap-2">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            {user?.role === "ADMIN" || user?.role === "DESIGNER" ? (
              <FormUtil
                name="Editar"
                description="Edite este pedido"
                defaultValues={{}}
                type="update"
                id={row.original.id}
              />
            ) : null}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-red-500 hover:text-red-600 hover:bg-red-100" variant={"ghost"}>Excluir</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Excluir pedido "{row.original.vision}"
                  </DialogTitle>
                  <DialogDescription>Quer mesmo excluir este pedido?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant={"destructive"}
                      className="bg-red-500 hover:bg-red-600 text-white ml-2"
                      onClick={() => {
                        try {
                          // removeUser(row.original.id);
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
