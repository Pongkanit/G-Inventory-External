import { Activity } from "@/models/Activity";
import { Sheet, SpreadsheetId } from "./CommonApiCall";

export async function GetAllActivities() {
    const range = "Activities";
    let ret;
    try {
        const response = await Sheet.spreadsheets.values.get({
            spreadsheetId: SpreadsheetId,
            range,
            valueRenderOption: "FORMULA",
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log("No data found.");
            return;
        }

        // Extract headers
        const headers = rows[0];

        const data = rows.slice(1).map((row) => {
            let rowData: { [key: string]: string | null } = {};
            headers.forEach((header, index) => {
                rowData[
                    header
                        .toLowerCase()
                        .trim()
                        .replace(/ /g, "_")
                        .replace(".", "")
                ] = row.length > index ? row[index] : "";
            });
            return rowData;
        });

        const activities: Activity[] = data.map(
            (item) => new Activity({ ...item })
        );
        ret = JSON.stringify(activities, null, 2);
    } catch (err) {
        console.error("The API returned an error: ", err);
    }

    return new Response(ret);
}

export async function PostActivity(request: Request) {
    const range = "Activities"; // Specify only the sheet name to append to the last row

    try {
        const activity = new Activity(await request.json());
        const activityArray = activity.toArray();

        const response = await Sheet.spreadsheets.values.append({
            spreadsheetId: SpreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS", // Ensure new data is inserted as new rows
            requestBody: {
                values: [activityArray],
            },
        });

        return new Response(JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("The API returned an error: ", err);
        throw new Error("Failed to post data to Google Sheets");
    }
}
