"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    HeaderContext,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Activity } from "@/models/Activity";
import { PartItem } from "@/models/PartItem";
import { extractImageUrl } from "@/lib/CommonFunction";
import Image from "next/image";
import SortableHeader from "@/components/SortableHeader";

const GetImageUrl = (part_no: string) => {
    if (itemsData) {
        const item = itemsData.find((item) => item.part_no == part_no);
        if (item) {
            return extractImageUrl(item.picture);
        }
    }
    return "";
};
let itemsData: PartItem[];
export const columns: ColumnDef<Activity>[] = [
    {
        accessorKey: "date",
        header: ({ column }: HeaderContext<Activity, unknown>) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Date
                    <CaretSortIcon />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("date")}</div>
        ),
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Sku/Code." }),
        accessorKey: "item",
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Name" }),
        accessorKey: "item_name",
    },
    {
        header: "Preview",
        accessorKey: "picture",
        cell: ({ row }) => {
            let imageUrl = GetImageUrl(row.getValue("item"));
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
        accessorFn: (row) => row.type,
        id: "type",
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Qty." }),
        accessorFn: (row) => row.qty,
        id: "qty",
    },
];
interface ActivityProps {
    activitiesData: Activity[];
    setActivitiesData: React.Dispatch<React.SetStateAction<Activity[]>>;
    items: PartItem[];
}

export const ListActivities: React.FC<ActivityProps> = ({
    activitiesData,
    setActivitiesData,
    items,
}) => {
    if (items) {
        itemsData = items;
    }
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: activitiesData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="rounded-md overflow-auto h-80">
                <Table>
                    <TableHeader className="sticky1">
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
