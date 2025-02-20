"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsersContext } from "@/contexts/users.context";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import type { User } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function FormUtil({
  name,
  type,
  description,
  defaultValues = {
    email: "",
    password: "",
    username: "",
  },
  id,
}: {
  name: string;
  description: string;
  type: "create" | "update";
  defaultValues?: Partial<User>;
  id?: number;
}) {
  const { addUser, updateUser } = useUsersContext();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    email: z.string().email({ message: "Email inválido." }),
    password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres." })
      .optional(),
    username: z.string(),
    role: z.any(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultValues.email,
      password: defaultValues.password,
      username: defaultValues.username,
      role: defaultValues.role,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === "create") {
      try {
        await addUser({
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
        });

        setIsOpen(false);
      } catch (ex: unknown) {
        if (ex instanceof AxiosError) {
          if (ex.response?.data.message === "User not found") {
            toast({
              description: "E-mail não encontrado",
            });
          }
          if (ex.response?.data.statusCode === 400) {
            toast({
              description: "Email ja existente",
            });
          }
        }
      }
    }
    if (type === "update" && id) {
      try {
        await updateUser(id, {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
        });

        setIsOpen(false);
      } catch (ex: unknown) {
        toast({ description: "Erro ao atualizar usuário" });
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={type === "create" ? "w-full md:w-max md:self-end" : ""}>
        <Button variant={type === "create" ? "default" : "ghost"}  className="w-full">{name}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{description}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="MANAGER">Gestor</SelectItem>
                        <SelectItem value="CUSTOMER">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
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
                // className="bg-mainBlue hover:bg-[#38327b] hover:text-white text-white font-semibold rounded-full"
                type="submit"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
