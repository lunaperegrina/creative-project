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
import { useInventoryContext } from "@/contexts/inventory.context";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import type { Product } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MultipleFileUpload } from "@/components/multiple-file-upload"
import api from "@/services/api";

interface FileWithPreview extends File {
  preview: string
}
interface MultipleFileUploadProps {
  setFiles: (files: FileWithPreview[]) => void;
}

export default function FormUtil({
  name,
  type,
  defaultValues = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    // imageUrl: "",
    active: true,
  },
  id,
}: {
  name: string;
  description: string;
  type: "create" | "update";
  defaultValues?: Partial<Product>;
  id?: number;
}) {
  const { addProduct, updateProduct } = useInventoryContext();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: "success" | "error" | null }>({});

  const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
    price: z.number().positive("O preço deve ser maior que zero"),
    stock: z.number().int().nonnegative("O estoque não pode ser negativo"),
    sku: z.string().min(1, "SKU é obrigatório"),
    active: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues.name || "",
      description: defaultValues.description || "",
      price: defaultValues.price ?? 0, // Usar "??" para aceitar zero como valor válido
      stock: defaultValues.stock ?? 0,
      sku: defaultValues.sku || "",
      active: defaultValues.active ?? true,
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // Inicializa o status de upload para cada arquivo
    const initialUploadStatus: { [key: string]: "success" | "error" | null } = {};
    files.forEach(file => {
      initialUploadStatus[file.name] = null;
    });
    setUploadStatus(initialUploadStatus);

    // Upload dos arquivos
    for (const file of files) {
      try {
        // Get pre-signed URL
        console.log(file)

        const response = await api.post("/s3/upload",
          { fileName: file.name, fileType: file.type })

        const { url, fields } = await response.data

        // Prepare form data for upload
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append("file", file);

        // Upload to S3
        const uploadResponse = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        // Atualiza o status de upload para sucesso
        setUploadStatus(prevStatus => ({
          ...prevStatus,
          [file.name]: "success",
        }));
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast({ description: `Erro ao enviar o arquivo ${file.name}` });

        // Atualiza o status de upload para erro
        setUploadStatus(prevStatus => ({
          ...prevStatus,
          [file.name]: "error",
        }));
        return;
      }
    }

    if (!files.length) {
      toast({ description: "Nenhum arquivo selecionado" });
      return;
    }

    // Envio dos dados do formulário
    if (type === "create") {
      try {
        await addProduct({
          name: values.name,
          description: values.description,
          price: values.price,
          stock: values.stock,
          sku: values.sku,
          active: values.active,
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
        await updateProduct(id, {
          name: values.name,
          description: values.description,
          price: values.price,
          stock: values.stock,
          sku: values.sku,
          active: values.active,
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
        <Button variant={type === "create" ? "outline" : "ghost"} className="w-full">{name}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Criar um novo produto</DialogTitle>
        </DialogHeader>

        {/* <pre>
          {JSON.stringify(form.watch(), null, 2)}
        </pre> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>sku</FormLabel>
                      <FormControl>
                        <Input placeholder="sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>name</FormLabel>
                      <FormControl>
                        <Input placeholder="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>description</FormLabel>
                      <FormControl>
                        <Input placeholder="description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Price"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}

                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Stock"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue="true">
                          <SelectTrigger className="w-[180px]" >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Ativo</SelectItem>
                            <SelectItem value="false">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <MultipleFileUpload setFiles={setFiles} files={files} setUploadStatus={setUploadStatus} uploadStatus={uploadStatus} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button
                disabled={form.formState.isSubmitting}
                // className="bg-[#5143F1] hover:bg-[#38327b] hover:text-white text-white font-semibold rounded-full"
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
