"use client";

import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination: Pagination;
  setPagination: (pagination: Partial<Pagination>) => void;
}

export function DataTablePagination<TData>({ table, pagination, setPagination }: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");
  const pathname = usePathname();

  useEffect(() => {
    if (!page || !perPage) {
      updatePagination({});
    }

    if (page && perPage) {
      setPagination({
        ...pagination,
        currentPage: Number.parseInt(page, 10),
        perPage: Number.parseInt(perPage, 10),
      });
    }
  }, []);

  useEffect(() => {
    updatePagination({
      page: pagination.currentPage,
      perPage: pagination.perPage,
    });
  }, [pagination.currentPage, pagination.perPage]);

  function updatePagination({ page, perPage }: { page?: number; perPage?: number }) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("perPage", perPage ? perPage.toString() : pagination.perPage.toString());
    newSearchParams.set("page", page ? page.toString() : pagination.currentPage.toString());

    router.push(`${pathname}?${newSearchParams.toString()}`);
  }

  return (
    <div className="flex items-center justify-end px-2 mt-4 z-0">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              setPagination({ perPage: Number.parseInt(value) });
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">Por pagina</p>
        </div>
        <div className="flex w-[150px] items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex} de {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() => setPagination({ currentPage: 1 })}
            disabled={table.getState().pagination.pageIndex === 1}
          >
            <span className="sr-only">Vá para a primeira página</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPagination({
                currentPage: table.getState().pagination.pageIndex - 1,
              })
            }
            disabled={table.getState().pagination.pageIndex === 1}
          >
            <span className="sr-only">Vá para a página anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPagination({
                currentPage: table.getState().pagination.pageIndex + 1,
              })
            }
            disabled={table.getState().pagination.pageIndex === table.getPageCount()}
          >
            <span className="sr-only">Vá para a página seguinte</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() => setPagination({ currentPage: table.getPageCount() })}
            disabled={table.getState().pagination.pageIndex === table.getPageCount()}
          >
            <span className="sr-only">Vá para a última pagina</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
