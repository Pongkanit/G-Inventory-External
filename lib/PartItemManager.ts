import { PartItem } from "@/models/PartItem";
import { Sheet, SpreadsheetId } from "./CommonApiCall";

export async function GetAllPartItems() {
    const range = "G-Inventory!A:X";
    let ret;
    try {
        const response = await Sheet.spreadsheets.values.get({
            spreadsheetId: SpreadsheetId,
            range,
            valueRenderOption: "FORMULA",
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return;
        }

        // Extract headers
        const headers = rows[0];
        const partNoIndex = headers.indexOf("Part No./Supplier Code");
        const codeNoIndex = headers.indexOf("Code/SKU  (6 digits)");
        const data = rows
            .slice(1)
            .filter((row) => {
                // Check if "code/sku" exists and is not empty
                return (
                    row.length > partNoIndex &&
                    (row[partNoIndex] || row[codeNoIndex])
                );
            })
            .map((row) => {
                let rowData: { [key: string]: string } = {};
                headers.forEach((header, index) => {
                    let normalizedHeader;

                    if (header === "Part No./Supplier Code") {
                        normalizedHeader = "part_no";
                    } else if (header === "Code/SKU  (6 digits)") {
                        normalizedHeader = "code_sku";
                    } else if (header === "Unit Price excl.VAT") {
                        normalizedHeader = "unit_price";
                    } else {
                        normalizedHeader = header
                            .toLowerCase()
                            .trim()
                            .replace(/ /g, "_")
                            .replace(".", "");
                    }

                    rowData[normalizedHeader] =
                        row.length > index ? row[index] : "";
                });
                return rowData;
            });
        const partItemArray: PartItem[] = data.map(
            (item) => new PartItem({ ...item })
        );

        ret = JSON.stringify(partItemArray, null, 2);
    } catch (err) {
        console.error("The API returned an error: ", err);
        ret = "Error: " + err;
    }

    return new Response(ret);
}

export async function UpdateQty(data: any) {
    const partItem = new PartItem(data.partItem);
    const qty = data.qty;

    await UpdateNumberCellBySku(partItem.code_sku, "Remaining Qty.", qty);
    return new Response(JSON.stringify("OK", null, 2));
}

export async function AddOrUpdatePartItem(body: any) {
    const partItem = new PartItem(body.partItem);

    try {
        const range = "G-Inventory!A:X";
        const response = await Sheet.spreadsheets.values.get({
            spreadsheetId: SpreadsheetId,
            range,
            valueRenderOption: "FORMULA",
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            throw new Error("Failed to post data to Google Sheets");
        }

        // Extract headers
        const headers = rows[0];

        // Initialize rowData with empty strings for each header
        const rowData = new Array(headers.length).fill("");
        type ProductHeader =
            | "Type"
            | "Category"
            | "Code/SKU  (6 digits)"
            | "Barcode"
            | "Product Name"
            | "Description"
            | "Part No./Supplier Code"
            | "Picture"
            | "Unit Price excl.VAT"
            | "Remaining Qty."
            | "Unit"
            | "Latest Updated"
            | "Min"
            | "Max"
            | "Blank" // there is blank column here in sheet
            | "Rack"
            | "Shelf"
            | "Supplier"
            | "Contact"
            | "Remark Project name"
            | "Total Value";

        const dataMap: Record<ProductHeader, string> = {
            Type: partItem.type,
            Category: partItem.category,
            "Code/SKU  (6 digits)": partItem.code_sku,
            Barcode: partItem.barcode,
            "Product Name": partItem.product_name,
            Description: partItem.description,
            "Part No./Supplier Code": partItem.part_no,
            Picture: partItem.picture,
            "Unit Price excl.VAT": partItem.unit_price,
            "Remaining Qty.": partItem.remaining_qty,
            Unit: partItem.unit,
            "Latest Updated": partItem.latest_updated,
            Min: partItem.min,
            Max: partItem.max,
            Blank: "",
            Rack: partItem.rack,
            Shelf: partItem.shelf,
            Supplier: partItem.supplier,
            Contact: partItem.contact,
            "Remark Project name": partItem.remark_project_name,
            "Total Value": partItem.total_value,
        };

        // Populate rowData based on headers
        headers.forEach((header, index) => {
            const validHeader = header as ProductHeader;
            if (validHeader in dataMap) {
                rowData[index] = dataMap[validHeader].toString();
            }
        });

        const skuIndex = headers.indexOf("Code/SKU  (6 digits)");
        let isDuplicate = false;
        for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            const skuValue = row[skuIndex];

            // Check Part No,
            if (skuValue == partItem.code_sku && skuValue != "") {
                isDuplicate = true;
                const updateRange = `${
                    range.split("!")[0]
                }!${String.fromCharCode(65)}${
                    rowIndex + 1
                }:${String.fromCharCode(65 + rowData.length)}${rowIndex + 1}`;

                await Sheet.spreadsheets.values.update({
                    spreadsheetId: SpreadsheetId,
                    range: updateRange,
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        values: [rowData],
                    },
                });

                break;
            }
        }
        // add new item
        if (!isDuplicate) {
            const updateRange = `${range.split("!")[0]}!${String.fromCharCode(
                65
            )}${rows.length + 1}:${String.fromCharCode(65 + rowData.length)}${
                rows.length + 1
            }`;

            await Sheet.spreadsheets.values.update({
                spreadsheetId: SpreadsheetId,
                range: updateRange,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [rowData],
                },
            });
        }
    } catch (err) {
        console.error("The API returned an error: ", err);
        throw new Error("Failed to post data to Google Sheets");
    }
    return new Response(JSON.stringify("OK", null, 2));
}

async function UpdateNumberCellBySku(
    code_sku: string,
    column_name: string,
    total: number
) {
    try {
        const range = "G-Inventory!A:X";
        const response = await Sheet.spreadsheets.values.get({
            spreadsheetId: SpreadsheetId,
            range,
            valueRenderOption: "FORMULA",
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            throw new Error("Failed to post data to Google Sheets");
        }

        // Extract headers
        const headers = rows[0];
        const skuIndex = headers.indexOf("Code/SKU  (6 digits)");

        if (skuIndex !== -1) {
            for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];
                const skuValue = row[skuIndex];

                // Check if the "Part No." value in this row matches "123"
                if (skuValue == code_sku) {
                    const qtyIndex = headers.indexOf(column_name);
                    // Check if the "Qty" column was found
                    if (qtyIndex !== -1) {
                        let curValue = parseInt(row[qtyIndex]);
                        if (!curValue) {
                            curValue = 0;
                        }
                        if (!isNaN(curValue)) {
                            const newQty = curValue + total;
                            row[qtyIndex] = newQty.toString(); // Convert it back to a string

                            const updateRange = `${
                                range.split("!")[0]
                            }!${String.fromCharCode(65 + qtyIndex)}${
                                rowIndex + 1
                            }`;

                            await Sheet.spreadsheets.values.update({
                                spreadsheetId: SpreadsheetId,
                                range: updateRange,
                                valueInputOption: "USER_ENTERED",
                                requestBody: {
                                    values: [[newQty.toString()]],
                                },
                            });
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("The API returned an error: ", err);
        throw new Error("Failed to post data to Google Sheets");
    }
}

export async function UpdatePicture(data: any) {
    const partItem = new PartItem(data.partItem);
    const picture = partItem.picture;

    await UpdateCellBySku(
        partItem.code_sku,
        "Picture",
        picture,
        partItem.latest_updated
    );

    return new Response(JSON.stringify("OK", null, 2));
}

async function UpdateCellBySku(
    code_sku: string,
    column_name: string,
    cellContent: string,
    date: string
) {
    try {
        const range = "G-Inventory!A:X";
        const response = await Sheet.spreadsheets.values.get({
            spreadsheetId: SpreadsheetId,
            range,
            valueRenderOption: "FORMULA",
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            throw new Error("Failed to post data to Google Sheets");
        }

        // Extract headers
        const headers = rows[0];
        const skuIndex = headers.indexOf("Code/SKU  (6 digits)");

        if (skuIndex !== -1) {
            for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
                const row = rows[rowIndex];
                const skuValue = row[skuIndex];

                // Check if the "Part No." value in this row matches
                if (skuValue == code_sku) {
                    const updatedColumn = headers.indexOf(column_name);
                    // Check if the column was found
                    if (updatedColumn !== -1) {
                        const updateRange = `${
                            range.split("!")[0]
                        }!${String.fromCharCode(65 + updatedColumn)}${
                            rowIndex + 1
                        }`;

                        await Sheet.spreadsheets.values.update({
                            spreadsheetId: SpreadsheetId,
                            range: updateRange,
                            valueInputOption: "USER_ENTERED",
                            requestBody: {
                                values: [[cellContent]],
                            },
                        });
                    }

                    const latestColumn = headers.indexOf("Latest Updated");
                    // Check if the column was found
                    if (latestColumn !== -1) {
                        const updateRange = `${
                            range.split("!")[0]
                        }!${String.fromCharCode(65 + latestColumn)}${
                            rowIndex + 1
                        }`;

                        await Sheet.spreadsheets.values.update({
                            spreadsheetId: SpreadsheetId,
                            range: updateRange,
                            valueInputOption: "USER_ENTERED",
                            requestBody: {
                                values: [[date]],
                            },
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error("The API returned an error: ", err);
        throw new Error("Failed to post data to Google Sheets");
    }
}
