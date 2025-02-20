"use client";

import { DataTable } from "@/components/data-table/data-table";
import { TypographyH2 } from "@/components/typography";
import { useAuthContext } from "@/contexts/auth.context";
import { useUsersContext } from "@/contexts/users.context";
import authByRole from "@/hooks/auth-by-role";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import FormUtil from "./form";

function Users() {
  const { user } = useAuthContext();
  const { users, getUsers, isLoading, filter, setFilter, pagination, setPagination } = useUsersContext();
  const [debounceFilter, setDebounceFilter] = useState("");

  const debounceValue = useDebounce(filter, 2000);

  useEffect(() => {
    setDebounceFilter(filter);
  }, [debounceValue]);

  useEffect(() => {
    if (!user) return;
    getUsers();
  }, [pagination.currentPage, pagination.perPage, debounceFilter, user]);

  return (
    <>
      <TypographyH2>Usuários</TypographyH2>
      <div className="flex flex-col">
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
    </>
  );
}

export default authByRole(Users, ["ADMIN", "MANAGER"]);
