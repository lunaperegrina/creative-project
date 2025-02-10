"use client";
import { DataTable } from "@/components/data-table/data-table";
import StoreNotFound from "@/components/store-not-found";
import { TypographyH1 } from "@/components/ui/typography";
import { useAuthContext } from "@/contexts/auth.context";
import { useOrdersContext } from "@/contexts/orders.context";
import { useWalletContext } from "@/contexts/wallet.context";
import authByRole from "@/hocs/auth-by-role";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { columns } from "./columns";

function Orders() {
  const { user } = useAuthContext();
  const { activeWallet } = useWalletContext();

  const { orders, getOrders, isLoading, filter, setFilter, pagination, setPagination } = useOrdersContext();

  const [debounceFilter, setDebounceFilter] = useState("");

  const debounceValue = useDebounce(filter, 2000);

  useEffect(() => {
    setDebounceFilter(filter);
  }, [debounceValue]);

  useEffect(() => {
    if (!user || (!activeWallet && user.role !== "ADMIN")) return;

    getOrders(activeWallet?.store_id);
  }, [pagination.currentPage, pagination.perPage, debounceFilter, user, activeWallet]);

  if (user?.role !== "ADMIN" && !activeWallet) {
    return <StoreNotFound />;
  }

  return (
    <>
      <TypographyH1>Pedidos</TypographyH1>
      <div className="flex flex-col">
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

export default authByRole(Orders,"all");
