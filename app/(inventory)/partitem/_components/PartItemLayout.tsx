"use client";
import React from "react";
import PartItemForm from "./PartItemForm";
import ScanInput from "@/components/ScanInput";
import { PartItem } from "@/models/PartItem";
import { fetchData } from "@/lib/CommonClientFunctions";
import { Button } from "@/components/ui/button";

export default function PartItemLayout() {
    const [partItemsData, setPartItemsData] = React.useState<PartItem[]>([]);
    const [partItem, setPartItem] = React.useState<PartItem>();
    // function
    const getItems = async () => {
        const rawData: PartItem[] = await fetchData("/api/items");
        const PartItems = rawData.map((item: PartItem) => new PartItem(item));
        setPartItemsData(PartItems);
    };
    // effect
    React.useEffect(() => {
        getItems();
    }, [partItem]);

    const handleScan = (scannedInput: string) => {
        if (scannedInput != "") {
            const item = partItemsData.find(
                (item) =>
                    item.part_no == scannedInput ||
                    item.code_sku == scannedInput
            );
            if (item) {
                setPartItem(item);
                return true;
            }
            return false;
        }
        return true;
    };
    // change picture
    const handleChangePicture = (
        partItem: React.SetStateAction<PartItem | undefined>
    ) => {
        getItems();
        setPartItem(partItem);
    };

    // add
    const handleAdd = () => {
        setPartItem(new PartItem());
        handleScan("");
    };
    // reset
    const handleReset = () => {
        setPartItem(undefined);
        setPartItemsData([]);
        getItems();
    };

    // use effect
    React.useEffect(() => {
        if (!partItem) {
            handleReset();
        }
    }, [partItem]);

    return (
        <div className="p-4">
            <div className="flex flex-row gap-4 w-1/3 pb-8">
                <ScanInput
                    onScan={handleScan}
                    isDisable={!partItemsData.length}
                />
                <div className="flex justify-start items-start">
                    <Button
                        onClick={handleAdd}
                    >
                        Add new
                    </Button>
                </div>
            </div>
            <div>
                <PartItemForm
                    partItem={partItem}
                    partItems={partItemsData}
                    onSubmit={handleReset}
                    updateImage={handleChangePicture}
                />
            </div>
        </div>
    );
}
