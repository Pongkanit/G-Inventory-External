"use client";
import React from "react";
import { PartItem } from "@/models/PartItem";
import { fetchData } from "@/lib/CommonClientFunctions";
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
import HoverKanban from "./HoverKanban";
import {
    CapitalizeFirstLetter,
    extractImageUrl,
    toggleSorting,
} from "@/lib/CommonFunction";
import Image from "next/image";
import { HealthStatus } from "@/models/Enum";
import SortableHeader from "./SortableHeader";
function PartItemStatusTable() {
    const [partItemsData, setPartItemsData] = React.useState<PartItem[]>([]);
    // function
    const getItems = async () => {
        const rawData: PartItem[] = await fetchData("/api/items");
        const PartItems = rawData.map((item: PartItem) => new PartItem(item));

        const mappedPartItems = PartItems.map((item) => {
            const qty = Number(item.remaining_qty != "" ? item.remaining_qty : 0);
            const min = Number(item.min != "" ? item.min : 0);
            const max = Number(item.max != "" ? item.max : 0);
            let status;
            if (qty >= max) {
                status = 4;
            } else if (qty > min * 1.25) {
                status = 3;
            } else if (qty > min * 0.75) {
                status = 2;
            } else {
                status = 1;
            }
            return { ...item, stockStatus: status };
        })

        const filteredPartItems = mappedPartItems.filter(
            (item) =>
                item.remaining_qty != "" &&
                item.min != ""
            // &&
            // Number(item.remaining_qty) <= Number(item.min) * 1.25
        );
        const sortedPartItems: PartItem[] = (filteredPartItems.sort(
            (a, b) => {
                return a.stockStatus - b.stockStatus
            }
        )) as PartItem[];
        setPartItemsData(sortedPartItems);
    };

    // effect
    React.useEffect(() => {
        getItems();
    }, []);

    return (
        <div>
            <ListPartItems kanbanData={partItemsData}></ListPartItems>
        </div>
    );
}

const HealthStatusOrder = {
    [HealthStatus.Full]: 4,
    [HealthStatus.Healthy]: 3,
    [HealthStatus.Poor]: 2,
    [HealthStatus.Critical]: 1,
};

export default PartItemStatusTable;

const columns: ColumnDef<PartItem>[] = [
    {
        accessorKey: "No.",
        header: "No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        accessorKey: "code_sku",
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Sku/Code" }),
    },
    {
        accessorKey: "part_no",
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Part number" }),
    },
    {
        accessorKey: "product_name",
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Name" }),
        cell: ({ row }) => (
            <div className="text-left">
                <HoverKanban
                    name={row.getValue("product_name")}
                    Kanban={row.original}
                />
            </div>

        ),
    },
    {
        header: "Preview",
        accessorKey: "picture",
        cell: ({ row }) => {
            let imageUrl = extractImageUrl(row.getValue("picture"));
            if (imageUrl) {
                return (
                    <div className="flex justify-center">
                        <Image src={imageUrl} alt="Kanban" width={20} height={20} />
                    </div>

                );
            }
            return "";
        },
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Remaining" }),
        id: "remaining",
        accessorFn: (row) => {
            return row.remaining_qty == "" ? 0 : row.remaining_qty;
        },
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Min" }),
        id: "min",
        accessorFn: (row) => {
            return row.min == "" ? 0 : row.min;
        },
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Max" }),
        id: "max",
        accessorFn: (row) => {
            return row.max == "" ? 0 : row.max;
        },
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Type" }),
        accessorKey: "type",
    },
    {
        header: (column: HeaderContext<any, unknown>) =>
            SortableHeader({ column, name: "Project name" }),
        accessorKey: "remark_project_name",
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
                color = "bg-blue-300 text-blue-800";
            } else if (status === HealthStatus.Healthy) {
                color = "bg-green-300 text-green-800";
            } else if (status === HealthStatus.Poor) {
                color = "bg-yellow-300 text-yellow-800 animate-pulse scale-105";
            } else {
                color = "bg-red-300 text-red-800 animate-pulse scale-110";
            }
            return (
                <div className="flex justify-center items-center">
                    <p className={`font-bold text-center rounded-md w-fit px-2 ${color}`}>{CapitalizeFirstLetter(status)}</p>
                </div>
            );
        },
    },
];

interface ListPartItemsProps {
    kanbanData: PartItem[];
}
const ListPartItems: React.FC<ListPartItemsProps> = ({ kanbanData }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data: kanbanData,
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
        <div className="p-4">
            <div className="rounded-md border">
                <Table className="">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="px-2 text-center">
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
                                        <TableCell key={cell.id} className="text-center p-0 m-0">
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
                                    className="text-center p-0 m-0"
                                ></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
