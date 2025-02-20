"use state";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCartContext } from "@/contexts/cart.context";
import { intToBrl } from "@/utils/currency";
import type { Product } from "@prisma/client";
import { Minus, Plus } from "lucide-react";
import ProductModal from "./product-modal";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart, removeFromCart } = useCartContext();

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group flex flex-col rounded-lg hover:cursor-pointer hover:shadow-lg hover:outline hover:outline-1 hover:outline-gray-200">
            <div className="flex flex-col items-center">
              <img
                src={`https://picsum.photos/200/200`}
                alt="logo"
                width={400}
                height={400}
                className="rounded-2xl p-2 object-fit"
              />
            </div>
            <div className="flex flex-col gap-4 p-4">
              <h2 className="font-medium truncate">{product.name}</h2>
              <div className="flex flex-col gap-2">
                <div className="gap-2 flex flex-row">
                  <span>{intToBrl(product.price)}</span>
                  <span className="font-light text-gray-400">para 1 unidade</span>
                </div>
              </div>
              {cart.find((p) => p.id === product.id) ? (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(product.id);
                  }}
                  className=" items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex w-32 gap-2 transition"
                >
                  <Minus className="h-4 w-4" />
                  Remover
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!cart.find((p) => p.id === product.id)) {
                      addToCart(product);
                    }
                  }}
                  className="bg-primary text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input  hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex w-32 gap-2 transition"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[100%] sm:max-h-[100%] sm:max-w-[90%] lg:max-w-[80%]">
          <ProductModal product={product} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
