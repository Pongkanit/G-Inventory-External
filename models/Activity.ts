interface ActivityData {
    date?: string;
    item?: string;
    item_name?: string;
    type?: string;
    qty?: string;
    summary?: string;
    note?: string;
}

export class Activity {
    date: string;
    item: string;
    item_name: string;
    type: string;
    qty: string;
    summary: string;
    note: string;

    constructor(data: ActivityData = {}) {
        this.date = data.date ?? "";
        this.item = data.item ?? "";
        this.item_name = data.item_name ?? "";
        this.type = data.type ?? "";
        this.qty = data.qty ?? "";
        this.summary = data.summary ?? "";
        this.note = data.note ?? "";
    }

    toArray() {
        return [
            this.date,
            this.item,
            this.item_name,
            this.type,
            this.qty,
            this.summary,
            this.note,
        ];
    }

    async postData() {
        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this), // Convert the data to a JSON string
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}
