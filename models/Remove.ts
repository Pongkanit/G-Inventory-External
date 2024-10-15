interface RemoveData {
    date?: string;
    Code_sku?: string;
    qty?: string;
}
export class Remove {
    date: string;
    Code_sku: string;
    qty: string;

    constructor(data: RemoveData = {}) {
        this.date = data.date ?? "";
        this.Code_sku = data.Code_sku ?? "";
        this.qty = data.qty ?? "";
    }

    async PostData() {
        try {
            const response = await fetch("/api/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}
