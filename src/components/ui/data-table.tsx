import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
// import { DataTableToolbar } from "@/components/ui/data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  enablePagination?: boolean;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  initialState?: {
    sorting?: SortingState;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  enablePagination = true,
  pageCount,
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  pageSize = 10,
  totalItems,
  initialState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? []
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Disable built-in pagination if using server-side pagination
    manualPagination: enablePagination && !!pageCount,
    pageCount: pageCount || 0,
    initialState,
  });

  // Override pagination handlers for server-side pagination
  React.useEffect(() => {
    if (enablePagination && onPageChange && onPageSizeChange) {
      // Set current page
      if (currentPage !== table.getState().pagination.pageIndex + 1) {
        table.setPageIndex(currentPage - 1);
      }
    }
  }, [enablePagination, onPageChange, onPageSizeChange, currentPage, table]);

  // Custom pagination handlers
  const handlePageChange = React.useCallback(
    (pageIndex: number) => {
      if (onPageChange) {
        onPageChange(pageIndex + 1);
      }
    },
    [onPageChange]
  );

  const handlePageSizeChange = React.useCallback(
    (newPageSize: number) => {
      if (onPageSizeChange) {
        onPageSizeChange(newPageSize);
      }
    },
    [onPageSizeChange]
  );

  console.log(data);
  console.log("table.getRowModel().rows:", table.getRowModel().rows);
  console.log(
    "table.getRowModel().rows.length:",
    table.getRowModel().rows.length
  );
  console.log("isLoading:", isLoading);

  return (
    <div className="space-y-4">
      {/* <DataTableToolbar table={table} /> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" && (
                              <span className="text-xs">▲</span>
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <span className="text-xs">▼</span>
                            )}
                          </>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center align-middle p-0"
                >
                  <div className="flex justify-center items-center h-24">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {(totalItems && `Tổng cộng ${totalItems} mục`) || ""}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Mục mỗi trang</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  handlePageSizeChange(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top" className="bg-white">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Trang {currentPage} / {pageCount || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage - 2)}
                disabled={currentPage <= 1}
              >
                <span className="sr-only">Trang trước</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage)}
                disabled={currentPage >= (pageCount || 1)}
              >
                <span className="sr-only">Trang sau</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
