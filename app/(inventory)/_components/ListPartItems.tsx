"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
    CellContext,
    ColumnDef,
    ColumnFiltersState,
    HeaderContext,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PartItem } from "@/models/PartItem";
import {
    CapitalizeFirstLetter,
    excelDateToJSDate,
    extractImageUrl,
} from "@/lib/CommonFunction";
import { HealthStatus } from "@/models/Enum";
import HoverKanban from "@/components/HoverKanban";
import Image from "next/image";
import SortableHeader from "@/components/SortableHeader";
import { set } from "lodash";

const HealthStatusOrder = {
    [HealthStatus.Full]: 4,
    [HealthStatus.Healthy]: 3,
    [HealthStatus.Poor]: 2,
    [HealthStatus.Critical]: 1,
};

export const columns: ColumnDef<PartItem>[] = [
    {
        accessorKey: "code_sku",
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Sku/Code" }),
    },
    {
        accessorKey: "product_name",
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Name" }),
        cell: ({ row }) => (
            <HoverKanban
                name={row.getValue("product_name")}
                Kanban={row.original}
            />
        ),
    },
    {
        header: "Preview",
        accessorKey: "picture", // accessor is typically a string that matches the property name
        cell: ({ row }) => {
            let imageUrl = extractImageUrl(row.getValue("picture"));
            if (imageUrl) {
                return (
                    <Image src={imageUrl} alt="Kanban" width={20} height={20} />
                );
            }
            return "";
        },
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Type" }),
        accessorKey: "type",
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Stock" }),
        accessorKey: "remaining_qty",
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Min" }),
        accessorKey: "min",
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Max" }),
        accessorKey: "max",
    },
    {
        accessorFn: (row) => {
            const qty = Number(row.remaining_qty != "" ? row.remaining_qty : 0);
            const min = Number(row.min != "" ? row.min : 0);
            const max = Number(row.max != "" ? row.max : 0);
            let status: HealthStatus;
            if (qty >= max) {
                status = HealthStatus.Full;
            } else if (qty > min * 1.25) {
                status = HealthStatus.Healthy;
            } else if (qty > min * 0.75) {
                status = HealthStatus.Poor;
            } else {
                status = HealthStatus.Critical;
            }
            return status;
        },
        id: "stockStatus",
        sortingFn: (rowA, rowB, columnId) => {
            const a =
                HealthStatusOrder[rowA.getValue(columnId) as HealthStatus];
            const b =
                HealthStatusOrder[rowB.getValue(columnId) as HealthStatus];
            return a - b;
        },
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Status" }),
        cell: ({ row }: CellContext<PartItem, unknown>) => {
            const status = row.getValue("stockStatus") as HealthStatus;
            let color = "";
            if (status === HealthStatus.Full) {
                color = "font-bold text-blue-500";
            } else if (status === HealthStatus.Healthy) {
                color = "font-bold text-green-500";
            } else if (status === HealthStatus.Poor) {
                color = "font-bold text-yellow-500";
            } else {
                color = "font-bold text-red-500";
            }
            return <p className={color}>{CapitalizeFirstLetter(status)}</p>;
        },
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Latest Update" }),
        accessorFn: (row) => {
            return row.latest_updated != ""
                ? excelDateToJSDate(Number(row.latest_updated))
                : "";
        },
        id: "latest_updated",
    },
];
interface ListPartItemsProps {
    kanbanData: PartItem[];
    setKanbanData: React.Dispatch<React.SetStateAction<PartItem[]>>;
    onClickItem:React.Dispatch<React.SetStateAction<string>>;
}
export const ListPartItems: React.FC<ListPartItemsProps> = ({
    kanbanData,
    setKanbanData,
    onClickItem
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 20, //default page size
      });
      React.useEffect(() => {
        const { innerWidth: width, innerHeight: height } = window;
        setPagination({
            pageIndex: 0,
            pageSize: Math.floor((height - 300) / 38),
            });
      }
        , []);
    const table = useReactTable({
        data: kanbanData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter name..."
                    value={
                        (table
                            .getColumn("product_name")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("product_name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            ?.filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    onClick={()=> onClickItem(row.original.code_sku)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-0 text-center" >
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
