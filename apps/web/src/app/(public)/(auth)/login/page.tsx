"use client";

import { HighlightedButton } from "@/components/button";
import { PasswordInput } from "@/components/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/auth.context";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Login() {
  const { setUser } = useAuthContext();
  const { toast } = useToast();
  const [loginError, setLoginError] = useState<{
    isError: boolean;
    message?: string;
  }>({
    isError: false,
    message: "",
  });

  const formSchema = z.object({
    email: z.string().email({ message: "Email inválido." }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginError({
      isError: false,
    });

    try {
      const res = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("token", res.data.access_token);
      setUser({
        id: res.data.id,
        email: res.data.email,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        role: res.data.role,
      });
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        if (ex.response?.data.message === "User not found") {
          setLoginError({
            isError: true,
            message: "E-mail não encontrado",
          });
          return;
        }
        if (ex.response?.data.statusCode === 400) {
          setLoginError({
            isError: true,
            message: "E-mail e senha não conferem",
          });
          return;
        }

        setLoginError({
          isError: true,
          message: "Algo deu errado, tente novamente mais tarde",
        });
      }
    }
  }

  return (
    <div>
      <div className="grid lg:grid-cols-2 min-h-screen w-full">
        <div className="flex items-center justify-center bg-muted max-lg:hidden">
          <Image
            src="/images/swag-login.jpg"
            alt="Login Image"
            width={800}
            height={600}
            className="object-cover w-full h-full"
            style={{ aspectRatio: "800/600", objectFit: "cover" }}
          />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md max-lg:max-w-lg space-y-6 mx-4">
            <div className="space-y-2 text-start">
              <h1 className="text-3xl font-bold">Login</h1>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12" />
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
                      <div className="flex justify-between">
                        <FormLabel>Senha</FormLabel>
                        <Link
                          href="https://swag.yoobe.app/auth/signin/forgot-password"
                          className="text-sm font-medium underline underline-offset-4 hover:text-primary"
                          prefetch={false}
                        >
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginError.isError && (
                  <Alert variant={"destructive"}>
                    <AlertTriangle className="h-5 w-5 mt-1" />
                    <AlertTitle>Erro ao realizar o login</AlertTitle>
                    <AlertDescription>{loginError.message}</AlertDescription>
                  </Alert>
                )}
                <HighlightedButton
                  disabled={form.formState.isSubmitting}
                  className="mt-4 h-12 bg-[#5143F1] hover:bg-[#38327b] hover:text-white text-white font-semibold rounded-full"
                  type="submit"
                >
                  Entrar
                </HighlightedButton>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
