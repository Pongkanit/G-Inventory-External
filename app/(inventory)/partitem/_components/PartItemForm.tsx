"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PartItem, PartItemData } from "@/models/PartItem";
import { Category, No, Type, Unit } from "@/models/Enum";
import _ from "lodash";
import { excelDateToJSDate, extractImageUrl } from "@/lib/CommonFunction";
import Select, { SingleValue } from "react-select";
import ImageDiv from "./ImageDiv";
import Barcode from "react-barcode";
import { BarcodeImage } from "@/components/Barcode";
import PrintButton from "@/components/PrintButton";
import { on } from "events";

type PartItemFormProps = {
    partItem: PartItemData | undefined;
    partItems: PartItemData[] | undefined;
    onSubmit: () => void;
    updateImage: (partitem: PartItem) => void;
};

const options = Object.values(Unit).map((unit) => ({
    value: unit,
    label: unit,
}));

function PartItemForm({
    partItem,
    partItems,
    onSubmit,
    updateImage,
}: PartItemFormProps) {
    const [formData, setFormData] = useState<PartItemData | undefined>(
        new PartItem()
    );
    const [isDuplicatedSKU, setIsDuplicatedSKU] = useState<boolean>(false);
    const [isDuplicatedPartNo, setIsDuplicatedPartNo] =
        useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Form change
    const handleChange = (event: { target: { name: any; value: any } }) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: String(value),
        }));
    };

    // Image uploaded
    const changeImage = (imageUrl: string) => {
        setFormData((prevState) => ({
            ...prevState,
            picture: `=image("${imageUrl}")`,
        }));
        setImageUrl(extractImageUrl(formData?.picture));
    };
    const uploading = (uploading: boolean) => {
        console.log("upload changed to:", uploading);
        setIsUploading(uploading);
    };
    // Handle dropdown
    const handleSelectChange = (
        selectedOption: SingleValue<{ value: string; label: string }>
    ) => {
        setFormData((prevState) => ({
            ...prevState,
            unit: selectedOption ? selectedOption.value : "",
        }));
    };

    // check if code/sku is duplicated
    const checkDuplicatedSKU = () => {
        const filteredPartItems = partItems?.filter(
            (item) => item.code_sku == formData?.code_sku && item.code_sku != ""
        );
        if (filteredPartItems?.length) {
            setIsDuplicatedSKU(true);
        } else {
            setIsDuplicatedSKU(false);
        }
    };

    // check if partNo is duplicated
    const checkDuplicatedPartNo = () => {
        const filteredPartItems = partItems?.filter(
            (item) =>
                item.part_no == formData?.part_no &&
                item.part_no != "" &&
                item.code_sku != formData?.code_sku
        );
        if (filteredPartItems?.length) {
            setIsDuplicatedPartNo(true);
        } else {
            setIsDuplicatedPartNo(false);
        }
    };
    const getLatestSKU = (category: string | undefined) => {
        const current = partItems?.filter((item) => item.category == category);
        let latestCode = "1";
        const noCode = No[category as keyof typeof No];

        current?.forEach((item) => {
            if (item.code_sku) {
                let curNumber = parseInt(item.code_sku.substring(2));
                if (parseInt(latestCode) <= curNumber) {
                    latestCode = (curNumber + 1).toString();
                }
            }
        });
        // Convert the numeric latestCode to a string and pad it:
        const formattedLatestCode = latestCode.toString().padStart(4, "0");
        const fullCode = `${noCode}${formattedLatestCode}`;
        return fullCode;
    };
    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (formData) {
            formData.latest_updated = getTodayDate();
            const result = await new PartItem(formData).UpdatePartItem();
            if (result === "OK") {
                alert("Success");
            }
            if (isNew) {
                onSubmit();
                setFormData(new PartItem());
            }

        }
    };
    // effect
    React.useEffect(() => {
        if (partItem) {
            setFormData(partItem);
            if (_.isEqual(partItem, new PartItem())) {
                setIsNew(true);
            } else {
                setIsNew(false);
            }
        }
    }, [partItem]);
    React.useEffect(() => {
        if (isNew && formData?.category && formData.type) {
            let newSku = "";
            let barcode = "";
            newSku = getLatestSKU(formData.category);
            barcode = "*" + newSku + "*";
            setFormData((prevState) => ({
                ...prevState,
                code_sku: newSku,
                barcode: barcode,
            }));
        }
    }, [formData?.category, formData?.type]);
    React.useEffect(() => {
        checkDuplicatedSKU();
        checkDuplicatedPartNo();
        setImageUrl(extractImageUrl(formData?.picture));
    }, [formData]);
    return (
        <form
            className={`${partItem && !isUploading ? "" : "form-disable"}`}
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                <div className="grid grid-cols-2 gap-2">
                    <Label className="pb-0">
                        Type:
                        <select
                            className="h-10 flex w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                            name="type"
                            value={formData?.type}
                            onChange={handleChange}
                            disabled={isDuplicatedSKU}
                        >
                            <option value="">Select type</option>
                            {Object.values(Type).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </Label>
                    <Label>
                        Category:
                        <select
                            className="h-10 flex w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                            name="category"
                            value={formData?.category}
                            onChange={handleChange}
                            disabled={isDuplicatedSKU}
                        >
                            <option value="">Select category</option>
                            {Object.values(Category).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Label>
                    <Label>
                        Product name:
                        <Input
                            type="text"
                            name="product_name"
                            value={formData?.product_name}
                            onChange={handleChange}
                            required={true}
                        />
                    </Label>
                    <Label>
                        Description:
                        <Input
                            type="text"
                            name="description"
                            value={formData?.description}
                            onChange={handleChange}
                        />
                    </Label>
                    <Label>
                        Part no.:
                        <Input
                            type="text"
                            name="part_no"
                            value={formData?.part_no}
                            onChange={handleChange}
                        />
                        {isDuplicatedPartNo && (
                            <div style={{ color: "red" }}>Duplicated</div>
                        )}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Label>
                            Unit price:
                            <Input
                                type="number"

                                name="unit_price"
                                value={formData?.unit_price}
                                onChange={handleChange}
                            />
                        </Label>
                        <Label>
                            Unit:
                            <div className=" flex flex-col items-center justify-center">
                                <main className="flex flex-col items-center justify-center w-full flex-1 text-left">
                                    <Select
                                        instanceId="unit"
                                        className="w-full h-6"
                                        name="unit"
                                        value={options.find(
                                            (option) => option.value === formData?.unit
                                        )}
                                        onChange={handleSelectChange}
                                        options={options}
                                        placeholder="Select unit"
                                        isClearable
                                    />
                                </main>
                            </div>
                        </Label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <Label>
                            Min:
                            <Input
                                type="number"

                                name="min"
                                value={formData?.min}
                                onChange={handleChange}
                            />
                        </Label>
                        <Label>
                            Max:
                            <Input
                                type="number"

                                name="max"
                                value={formData?.max}
                                onChange={handleChange}
                            />
                        </Label>
                        <Label>
                            Remaining:
                            <Input
                                type="number"

                                name="remaining_qty"
                                value={formData?.remaining_qty}
                                onChange={handleChange}
                            />
                        </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Label>
                            Rack:
                            <Input
                                type="text"

                                name="rack"
                                value={formData?.rack}
                                onChange={handleChange}
                            />
                        </Label>
                        <Label>
                            Shelf
                            <Input
                                type="text"

                                name="shelf"
                                value={formData?.shelf}
                                onChange={handleChange}
                            />
                        </Label>
                    </div>
                    <Label>
                        Supplier:
                        <Input
                            type="text"
                            name="supplier"
                            value={formData?.supplier}
                            onChange={handleChange}
                        />
                    </Label>
                    <Label>
                        Contact:
                        <Input
                            type="text"
                            name="contact"
                            value={formData?.contact}
                            onChange={handleChange}
                        />
                    </Label>
                    <Label>
                        Remark project name
                        <Input
                            type="text"
                            name="remark_project_name"
                            value={formData?.remark_project_name}
                            onChange={handleChange}
                        />
                    </Label>
                    <Label>
                        Total Value:
                        <Input
                            type="text"
                            name="total_value"
                            value={formData?.total_value}
                            onChange={handleChange}
                        />
                    </Label>
                    {!isNew ?
                        (<Button className="py-4" type="submit">
                            Update
                        </Button>)
                        :
                        (<Button className="py-4" type="submit">
                            Add
                        </Button>)
                    }
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex flex-col items-center">
                            <Barcode value={formData?.code_sku || " "} format="CODE39" />
                            <p>{formData?.product_name}</p>
                        </div>
                        <PrintButton Kanban={partItem} />
                    </div>
                    <ImageDiv
                        image={imageUrl}
                        setImage={changeImage}
                        isUploading={uploading}
                        sku={formData?.code_sku}
                        disabled={formData?.category ? false : true}
                    />
                </div>
            </div>
        </form>
    );
}

export default PartItemForm;
