"use client";
import { DataTable } from "@/components/data-table/data-table";
import FileInput from "@/components/file-input";
import StoreNotFound from "@/components/store-not-found";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TypographyH1 } from "@/components/ui/typography";
import { useAuthContext } from "@/contexts/auth.context";
import { useUsersContext } from "@/contexts/users.context";
import { useWalletContext } from "@/contexts/wallet.context";
import authByRole from "@/hocs/auth-by-role";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { columns } from "./columns";
import FormUtil from "./form";

function Users() {
  const { user } = useAuthContext();
  const { activeWallet } = useWalletContext();

  const { users, getUsers, isLoading, filter, setFilter, pagination, setPagination } = useUsersContext();

  const [importUsers, setImportUsers] = useState<boolean>(false);
  const [seeExample, setSeeExample] = useState<boolean>(false);

  const router = useRouter();

  const { toast } = useToast();

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedObject, setSelectedObject] = useState<User | null>(null);

  const [debounceFilter, setDebounceFilter] = useState("");

  const debounceValue = useDebounce(filter, 2000);

  useEffect(() => {
    setDebounceFilter(filter);
  }, [debounceValue]);

  useEffect(() => {
    if (!user || (!activeWallet && user.role !== "ADMIN")) return;

    getUsers(activeWallet?.store_id);
  }, [pagination.currentPage, pagination.perPage, debounceFilter, user, activeWallet]);

  function handleRemove(obj: User) {
    setSelectedObject(obj);
    setDeleteOpen(true);
  }

  const formSchema = z.object({
    csv: z.array(z.any()).refine((files) => files.length > 0, {
      message: "Arquivo inválido.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!activeWallet) return;

    try {
      const res = await api.post(
        "/user/import",
        { store_id: activeWallet.store_id.toString(), file: values.csv[0] },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.createdUsers.length !== 0) {
        getUsers(activeWallet?.store_id);
      }
      toast({
        description: `${res.data.createdUsers.length === 0 ? "Todos os usuários já estavam inseridos na loja" : `${res.data.createdUsers.length} usuários criados com sucesso`}`,
      });
      setImportUsers(false);
    } catch (ex: unknown) {
      console.log(ex);
      toast({ description: "Erro ao importar usuários" });
    }
  }

  if (user?.role !== "ADMIN" && !activeWallet) {
    return <StoreNotFound />;
  }

  return (
    <>
      <TypographyH1>Usuários</TypographyH1>
      <div className="flex flex-col">
        {activeWallet && (
          <Button
            variant="outline"
            className="my-4 w-[200px] self-end"
            onClick={() => {
              form.reset();
              setImportUsers(true);
            }}
          >
            Importar usuários
          </Button>
        )}
        {user?.role === "ADMIN" && (
          <FormUtil name="Criar usuário" description="Adicione um novo usuário" type="create" />
        )}
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
      <Dialog open={importUsers} onOpenChange={setImportUsers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar usuários por CSV</DialogTitle>
            <DialogDescription>O arquivo csv deve ter o formato email, nome, sobrenome</DialogDescription>
          </DialogHeader>

          <Button className="w-max text-black" onClick={() => setSeeExample(!seeExample)}>
            {seeExample ? "Esconder exemplo" : "Mostrar exemplo"}
          </Button>

          {seeExample && (
            <Image
              src="/images/users-csv-example.png"
              alt="Example CSV"
              width={500}
              height={500}
              className="object-cover max-w-72"
            />
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="csv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arquivo</FormLabel>
                    <FormControl>
                      <FileInput {...field} maxFiles={1} acceptedFormats={["text/csv"]} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default authByRole(Users, ["ADMIN", "MANAGER"]);
