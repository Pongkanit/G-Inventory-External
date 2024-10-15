import { Sheet, SpreadsheetId } from "./CommonApiCall";

export async function UpdateRemove(request: Request) {
    let range = "Remove!A:C";
    try {
        const response1 = await Sheet.spreadsheets.values.get({
            spreadsheetId: SpreadsheetId,
            range,
        });

        const rows = response1.data.values;
        if (!rows || rows.length === 0) {
            console.log("No data found.");
            return new Response(JSON.stringify(1)); // If no data, return the first row
        }

        // Find the last row with data
        let insertRow = rows.length + 1; // Count of rows with data
        range = `Remove!A${insertRow}:C${insertRow}`;
        const data = Object.values(await request.json());
        const response = await Sheet.spreadsheets.values.append({
            spreadsheetId: SpreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [data],
            },
        });

        return new Response(JSON.stringify(response.data, null, 2));
    } catch (err) {
        throw new Error("Failed to post data to Google Sheets");
    }
}
