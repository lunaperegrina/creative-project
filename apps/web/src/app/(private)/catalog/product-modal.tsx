"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthContext } from "@/contexts/auth.context";
import { useCartContext } from "@/contexts/cart.context";
import { intToBrl } from "@/utils/currency";
import { Product } from "@prisma/client";
import { Minus, Plus } from "lucide-react";
// import Gallery from "./carousel-thumbnail-images";

export default function ProductModal({ product }: { product: Product }) {
  const { addToCart, cart, removeFromCart } = useCartContext();
  const { user } = useAuthContext();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 overflow-y-auto">
        <div className="flex-1">
          <img
            src={`https://picsum.photos/200/200`}
            alt="logo"
            width={400}
            height={400}
            className="rounded-2xl p-2 object-fit mx-auto"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h2 className="font-bold text-2xl mt-8">{product.name}</h2>
            <div className="flex flex-col gap-2">
              <div className="gap-2 flex flex-row items-center">
                <span className="font-bold text-2xl">{intToBrl(product.price)}</span>
                para 1 unidade
              </div>
            </div>
          </div>
          {cart.find((p) => p.id === product.id) ? (
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                removeFromCart(product.id);
              }}
              className="my-4 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex w-full gap-2 transition"
            >
              <Minus className="h-4 w-4" />
              Remover
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (!cart.find((p) => p.id === product.id)) {
                  addToCart(product);
                }
              }}
              className="my-4 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex w-full gap-2 transition"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {product.price.map((price, index) => (
                  <TableRow key={index}>
                    <TableCell>{price.quantity_min}</TableCell>
                    <TableCell>{intToBrl(price.unit_price)}</TableCell>
                  </TableRow>
                ))} */}
              <TableRow>
                <TableCell>{product.price}</TableCell>
                <TableCell>{intToBrl(product.price)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div>
            <p>Descrição</p>
            <p className="text-gray-500 mt-4">{product.description}</p>
            {user?.role === "ADMIN" && <p className="text-gray-400 mt-4">SKU: {product.sku}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
