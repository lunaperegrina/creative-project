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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Register() {
  const { setUser } = useAuthContext();
  const [loginError, setLoginError] = useState<{
    isError: boolean;
    message?: string;
  }>({
    isError: false,
    message: "",
  });

  const formSchema = z.object({
    username: z.string().min(3, { message: "Username deve ter pelo menos 3 caracteres." }),
    email: z.string().email({ message: "Email inválido." }),
    password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginError({
      isError: false,
    });

    try {
      const res = await api.post("/auth/register", {
        email: values.email,
        password: values.password,
        username: values.username
      });
      
      setUser(res.data);
    } catch (ex: unknown) {
      if (ex instanceof AxiosError) {
        console.log("ex", ex.response?.data);
        setLoginError({
          isError: true,
          message: ex.response?.data.error,
        });
      }
    }
  }

  return (
    <div>
      <div className="grid min-h-screen w-auto">
        {/* <div className="flex items-center justify-center bg-muted max-lg:hidden">
          <Image
            src="/images/swag-login.jpg"
            alt="Login Image"
            width={800}
            height={600}
            className="object-cover w-full h-full"
            style={{ aspectRatio: "800/600", objectFit: "cover" }}
          />
        </div> */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md max-lg:max-w-lg space-y-6 mx-4">
            <div className="space-y-2 text-start">
              {/* <h1 className="text-3xl font-bold">Criar conta</h1> */}
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  className="mt-4 h-12 bg-cyan-600 hover:bg-gray hover:text-white text-white font-semibold rounded-full"
                  type="submit"
                >
                  Criar conta
                </HighlightedButton>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
