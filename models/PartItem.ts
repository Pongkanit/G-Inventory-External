export interface PartItemData {
    type?: string;
    category?: string;
    code_sku?: string;
    kanban_no?: string;
    barcode?: string;
    product_name?: string;
    description?: string;
    part_no?: string;
    picture?: string;
    unit_price?: string;
    remaining_qty?: string;
    unit?: string;
    latest_updated?: string;
    min?: string;
    max?: string;
    rack?: string;
    shelf?: string;
    supplier?: string;
    contact?: string;
    remark_project_name?: string;
    total_value?: string;
    //supplier_no?: string;
    //additional_info?: string;
    //date_added?: string;
    //note?: string;
}
export class PartItem {
    type: string;
    category: string;
    code_sku: string;
    kanban_no: string;
    barcode: string;
    product_name: string;
    description: string;
    part_no: string;
    picture: string;
    unit_price: string;
    remaining_qty: string;
    unit: string;
    latest_updated: string;
    min: string;
    max: string;
    rack: string;
    shelf: string;
    supplier: string;
    contact: string;
    remark_project_name: string;
    total_value: string;
    stockStatus: number

    constructor(data: PartItemData = {}) {
        this.kanban_no = data.kanban_no ?? "";
        this.category = data.category ?? "";
        this.code_sku = data.code_sku ?? "";
        this.type = data.type ?? "";
        this.rack = data.rack ?? "";
        this.shelf = data.shelf ?? "";
        this.min = data.min ?? "0";
        this.max = data.max ?? "0";
        this.barcode = data.code_sku ? "*" + data.code_sku + "*" : "";
        this.product_name = data.product_name ?? "";
        this.part_no = data.part_no ?? "";
        this.supplier = data.supplier ?? "";
        this.contact = data.contact ?? "";
        this.picture = data.picture ?? "";
        this.remaining_qty = data.remaining_qty ?? "0";
        this.latest_updated = data.latest_updated ?? "";
        this.unit_price = data.unit_price ?? "0";
        this.total_value = data.total_value ?? "0";
        this.remark_project_name = data.remark_project_name ?? "";
        this.description = data.description ?? "";
        this.unit = data.unit ?? "0";
        this.stockStatus = 0
    }

    async UpdateQty(qty: number) {
        try {
            const response = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "updateQty",
                    partItem: this,
                    qty: qty,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async UpdatePartItem() {
        try {
            const response = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "updatePartItem",
                    partItem: this,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async UploadImagePartItem() {
        try {
            console.log("start calling update sheet");
            const response = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "uploadImagePartItem",
                    partItem: this,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}
