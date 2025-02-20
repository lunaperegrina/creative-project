'use client'

import { TypographyH2 } from "@/components/typography";
import { useAuthContext } from "@/contexts/auth.context";
import { useInventoryContext } from "@/contexts/inventory.context";
import authByRole from "@/hooks/auth-by-role";
import { useEffect } from "react";
import ProductCard from "./product-card";

function Catalog() {

  const { user } = useAuthContext();

  const { getProducts, products } = useInventoryContext();

  useEffect(() => {
    if (!user) return;
    getProducts();
  }, [user]);

  return (
    <div>
      <TypographyH2>Catálogo</TypographyH2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {/* {products.map((product, index) => (
          <div key={index}>
            <ProductCard product={product} />
          </div>
        ))} */}
      </div>
    </div>
  )
}

export default authByRole(Catalog, ["ADMIN", "MANAGER", "CUSTOMER"]);
