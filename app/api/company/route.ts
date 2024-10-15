import { Sheet, SpreadsheetId } from "@/lib/CommonApiCall";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (session) {
        const range = "Company!A1:B8";
        const response = await Sheet.spreadsheets.values.get({
            spreadsheetId: SpreadsheetId,
            range,
        });
        const data = response.data;
        const obj: { [key: string]: any } = {};
        data?.values?.forEach(([key, value]) => {
            obj[key] = value;
        });
        return NextResponse.json(obj);
    }
    return NextResponse.error();
}
