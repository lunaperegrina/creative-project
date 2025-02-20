"use client";

import { DataTable } from "@/components/data-table/data-table";
import { TypographyH2 } from "@/components/typography";
import { useAuthContext } from "@/contexts/auth.context";
import authByRole from "@/hooks/auth-by-role";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import FormUtil from "./form";
import { useOrdersContext } from "@/contexts/orders.context";

function Orders() {
  const { user } = useAuthContext();
  const { orders, getOrders, isLoading, filter, setFilter, pagination, setPagination } = useOrdersContext();
  const [debounceFilter, setDebounceFilter] = useState("");

  const debounceValue = useDebounce(filter, 2000);

  useEffect(() => {
    setDebounceFilter(filter);
  }, [debounceValue]);

  useEffect(() => {
    if (!user) return;
    getOrders();
  }, [pagination.currentPage, pagination.perPage, debounceFilter, user]);

  return (
    <>
      <TypographyH2>Pedidos</TypographyH2>
      <div className="flex flex-col">
        {user?.role === "ADMIN" && (
          <FormUtil name="Criar pedido" description="Adicione um novo pedido" type="create" />
        )}
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          filter={filter}
          setFilter={setFilter}
        />
      </div>
    </>
  );
}

export default authByRole(Orders, ["ADMIN", "DESIGNER", "CUSTOMER"]);
