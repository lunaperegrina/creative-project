"use client";

import { HighlightedButton } from "@/components/button";
import SearchableSelect from "@/components/searchable-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useOrdersContext } from "@/contexts/orders.context";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Order } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Usuário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `${row.original.user.first_name} ${row.original.user.last_name}`,
  },
  {
    accessorKey: "user.email",
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
    accessorKey: "store",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Loja
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `${row?.original?.store?.name || "Sem loja"}`,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "order_item",
    header: "Items",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col items-start gap-4">
            {row.original.order_item.map((item) => (
              <p>
                {item.quantity}x {item.name}
              </p>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "id",
    header: "Ações",
    cell: ({ row }) => {
      const { acceptOrder, undoAcceptOrder, shipOrder, undoShipOrder, doneOrder, undoDoneOrder } = useOrdersContext();
      const { getSelectableStores, selectableStores } = useStoresContext();
      const formSchema = z
        .object({
          future: z.boolean(),
          future_store_id: z.number().optional(),
        })
        .refine((input) => {
          if (input.future && !input.future_store_id) return false;
          return true;
        });

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          future: true,
        },
      });

      async function onSubmit(values: z.infer<typeof formSchema>) {
        await shipOrder(row.original.id, values);
      }

      useEffect(() => {
        getSelectableStores();
      }, []);

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
            {row?.original?.status === OrderStatus.ACCEPTED && (
              <Dialog>
                <DialogTrigger>Produtos Enviados</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Produtos Enviados</DialogTitle>
                    <DialogDescription>
                      Selecione se será enviado para alguma loja quando terminar o processo de envio ou se ficará no
                      estoque da yoobe
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="future"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2 col-span-full">
                            <FormLabel className="mt-2">Enviar para loja</FormLabel>
                            <FormControl>
                              <Switch
                                className="data-[state=checked]:bg-mainBlue items-center"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch("future") && (
                        <FormField
                          control={form.control}
                          name="future_store_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loja</FormLabel>
                              <FormControl>
                                <SearchableSelect {...field} placeholder="Loja" options={selectableStores} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <HighlightedButton
                        disabled={form.formState.isSubmitting}
                        className="mt-4 h-12 bg-[#5143F1] hover:bg-[#38327b] hover:text-white text-white font-semibold rounded-full"
                        type="submit"
                      >
                        Enviar
                      </HighlightedButton>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            {row?.original?.status === OrderStatus.AWAITING && (
              <DropdownMenuItem className="w-full" onClick={() => acceptOrder(row.original.id)}>
                Aceitar
              </DropdownMenuItem>
            )}
            {row?.original?.status === OrderStatus.ACCEPTED && (
              <DropdownMenuItem className="w-full" onClick={() => undoAcceptOrder(row.original.id)}>
                Desfazer
              </DropdownMenuItem>
            )}
            {row?.original?.status === OrderStatus.SHIPPED && (
              <DropdownMenuItem className="w-full" onClick={() => doneOrder(row.original.id)}>
                Produtos Chegaram
              </DropdownMenuItem>
            )}
            {row?.original?.status === OrderStatus.SHIPPED && (
              <DropdownMenuItem className="w-full" onClick={() => undoShipOrder(row.original.id)}>
                Desfazer
              </DropdownMenuItem>
            )}
            {row?.original?.status === OrderStatus.DONE && (
              <DropdownMenuItem className="w-full" onClick={() => undoDoneOrder(row.original.id)}>
                Desfazer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
