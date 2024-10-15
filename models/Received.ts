interface ReceivedData {
    date?: string;
    Code_sku?: string;
    qty?: string;
}
export class Received {
    date: string;
    Code_sku: string;
    qty: string;

    constructor(data: ReceivedData = {}) {
        this.date = data.date ?? "";
        this.Code_sku = data.Code_sku ?? "";
        this.qty = data.qty ?? "";
    }

    async PostData() {
        try {
            const response = await fetch("/api/receive", {
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

export async function PostReceived(content: Received[]) {
    try {
        const response = await fetch("/api/receive", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
