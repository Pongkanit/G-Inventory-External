"use client";
import { PartItem } from "@/models/PartItem";
import ScanInput from "@/components/ScanInput";
import { ListPartItems } from "./ListImport";
import React, { useEffect } from "react";
import { fetchData } from "@/lib/CommonClientFunctions";
import { Button } from "@/components/ui/button";
import { PartItemDTO } from "@/models/PartItemDTO";
import { ColumnDef, HeaderContext } from "@tanstack/react-table";
import HoverKanban from "@/components/HoverKanban";
import NumericStepper from "@/components/NumericStepper";
import { extractImageUrl } from "@/lib/CommonFunction";
import Image from "next/image";
import { Activity } from "@/models/Activity";
import { Received } from "@/models/Received";
import SortableHeader from "@/components/SortableHeader";
import { Trash2 } from "lucide-react";

export default function ImportLayout() {
    const [partItemsData, setPartItemsData] = React.useState<PartItem[]>([]);
    const [currentPartItemsImport, setCurrentPartItemsImport] = React.useState<
        PartItemDTO[]
    >([]);
    const handleScan = (scannedInput: React.SetStateAction<string>) => {
        const itemExist: PartItem | undefined = partItemsData.find(
            (item) =>
                item.part_no == scannedInput || item.code_sku == scannedInput
        );
        if (itemExist) {
            setCurrentPartItemsImport((currentItems) => {
                const scannedItemIndex = currentItems.findIndex(
                    (item) =>
                        item.part_no == scannedInput ||
                        item.code_sku == scannedInput
                );

                if (scannedItemIndex !== -1) {
                    // Item already exists, increment the total by 1
                    const updatedItems = [...currentItems];
                    const existingItem = updatedItems[scannedItemIndex];
                    const updatedTotal = (Number(existingItem.total) || 0) + 1;
                    updatedItems[scannedItemIndex] = {
                        ...existingItem,
                        total: updatedTotal,
                    };
                    return updatedItems;
                } else {
                    // Item does not exist, add it as new with total = 1
                    const newItem = partItemsData.find(
                        (item) =>
                            item.part_no == scannedInput ||
                            item.code_sku == scannedInput
                    );
                    if (newItem) {
                        const newItemDTO: PartItemDTO = {
                            ...newItem,
                            total: 1,
                        };
                        return [...currentItems, newItemDTO];
                    } else {
                        return currentItems; // No new item found, return the unchanged array
                    }
                }
            });
            return true;
        }
        return false;
    };

    const columnsDef: ColumnDef<PartItemDTO>[] = [
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
                <HoverKanban
                    name={row.getValue("product_name")}
                    Kanban={row.original}
                />
            ),
        },
        {
            accessorKey: "total",
            header: (column: HeaderContext<any, unknown>) =>
                SortableHeader({ column, name: "Qty." }),
            cell: ({ row }) => {
                const handleValueChange = (newValue: any) => {
                    setCurrentPartItemsImport((currentItems) => {
                        const scannedItemIndex = currentItems.findIndex(
                            (item) => item.part_no === row.getValue("part_no")
                        );
                        const updatedItems = [...currentItems];
                        const existingItem = updatedItems[scannedItemIndex];
                        updatedItems[scannedItemIndex] = {
                            ...existingItem,
                            total: newValue,
                        };
                        return updatedItems;
                    });
                };
                return (
                    <div className="w-16">
                        <NumericStepper
                            init={row.getValue("total")}
                            onChange={handleValueChange}
                        />
                    </div>
                );
            },
        },
        {
            header: "Preview",
            accessorKey: "picture", // accessor is typically a string that matches the property name
            cell: ({ row }) => {
                let imageUrl = extractImageUrl(row.getValue("picture"));
                if (imageUrl) {
                    return (
                        <div className="flex justify-start items-center">
                            <Image
                                src={imageUrl}
                                alt="Kanban"
                                width={36}
                                height={36}
                            />
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
                SortableHeader({ column, name: "Type" }),
            accessorKey: "type",
        },
        {
            header: (column: HeaderContext<any, unknown>) =>
                SortableHeader({ column, name: "Project name" }),
            accessorKey: "remark_project_name",
        },
        {
            header: " ",
            cell: ({ row }) => <div className="w-8"><Button variant="destructive" onClick={() => {
                setCurrentPartItemsImport((prev) => prev.filter((e) => e.code_sku !== row.original.code_sku))
            }}><Trash2 /></Button></div>,
        },
    ];
    // function
    const getItems = async () => {
        const rawData: PartItem[] = await fetchData("/api/items");
        const PartItems = rawData.map((item: PartItem) => new PartItem(item));
        setPartItemsData(PartItems);
    };

    const getTotalSum = (partItems: any[]) => {
        return partItems.reduce(
            (acc: number, item: { total: any }) => acc + Number(item.total),
            0
        );
    };

    const updateItem = async () => {
        currentPartItemsImport.map((item) => {
            // Update activity
            const activity = new Activity({
                date: new Date().toLocaleString(),
                item: item?.code_sku,
                item_name: item?.product_name,
                type: "Received",
                qty: item.total?.toString(),
                summary:
                    "Received" +
                    " " +
                    (item?.product_name ?? "") +
                    " (" +
                    (item?.code_sku ?? "") +
                    ") total: " +
                    item.total?.toString(),
            });
            activity.postData();

            // Removed or Received
            const received = new Received({
                date: new Date().toLocaleString(),
                Code_sku: item?.code_sku,
                qty: item.total?.toString(),
            });
            received.PostData();

            // update Part Items
            if (item.total) {
                new PartItem(item).UpdateQty(item.total);
            }
        });
        setCurrentPartItemsImport([]);
    };
    // effect
    useEffect(() => {
        getItems();
    }, []);

    return (
        <div className="w-auto p-4 flex flex-col gap-4">
            <ScanInput onScan={handleScan} isDisable={!partItemsData.length} />
            <div className="w-auto">
                <ListPartItems
                    kanbanData={currentPartItemsImport}
                    columnsDef={columnsDef}
                />
            </div>
            <div className="">
                {" "}
                total item(s): {getTotalSum(currentPartItemsImport)}
            </div>
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPartItemsImport([])}>
                    Reset
                </Button>
                <Button
                    variant="outline"
                    className="button-receive"
                    onClick={updateItem}
                >
                    Update
                </Button>
            </div>
        </div>
    );
}
