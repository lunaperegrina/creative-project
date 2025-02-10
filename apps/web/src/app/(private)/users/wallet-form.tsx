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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUsersContext } from "@/contexts/users.context";
import { useWalletContext } from "@/contexts/wallet.context";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

export default function WalletForm({
  name,
  description,
  defaultValues = {
    email: "",
    credits: "",
  },
  user_id,
}: {
  name: string;
  description: string;
  defaultValues?: {
    email: string;
    credits: string;
  };
  user_id: number;
}) {
  const { addCredit, removeCredit } = useUsersContext();
  const { activeWallet, selectableWallets, getSelectableWallets } = useWalletContext();
  const [addState, setAddState] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    email: z.string().email({ message: "Email inválido." }),
    credits: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!user_id) return;

    getSelectableWallets(user_id);
  }, [user_id, setIsOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user_id || !activeWallet) return;

    if (addState) {
      try {
        await addCredit(user_id, activeWallet.store_id, parseInt(values.credits));
        toast({ description: "Creditos adicionados com sucesso" });
        setIsOpen(false);
      } catch (ex: unknown) {
        console.log(ex);
        toast({ description: "Erro ao adicionar créditos" });
      }
    } else {
      try {
        await removeCredit(user_id, activeWallet.store_id, parseInt(values.credits));
        toast({ description: "Creditos removidos com sucesso" });
        setIsOpen(false);
      } catch (ex: unknown) {
        console.log(ex);
        toast({ description: "Erro ao remover créditos" });
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link">{name}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar carteira</DialogTitle>
          <DialogDescription>{form.getValues().email}</DialogDescription>
        </DialogHeader>
        {/* TODO: Pegar créditos de outro lugar */}
        {/* <p>Crédito: {selectableWallets.find((wallet) => wallet.store_id === activeWallet?.store_id)?.credits}</p> */}

        <div className="flex flex-row items-center gap-2">
          <Switch
            className="data-[state=checked]:bg-mainBlue items-center"
            checked={addState}
            onCheckedChange={setAddState}
          />
          <Label className="mt-2">Adicionar</Label>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => {
                const { ref: _, ...fieldWithoutRef } = field;
                return (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <NumericFormat {...fieldWithoutRef} placeholder="Quantidade" customInput={Input} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button
                disabled={form.formState.isSubmitting}
                className="bg-mainBlue hover:bg-[#38327b] hover:text-white text-white font-semibold rounded-full"
                type="submit"
              >
                Editar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
