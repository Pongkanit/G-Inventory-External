import { getServerSession } from "next-auth/next";
import {
    AddOrUpdatePartItem,
    GetAllPartItems,
    UpdateQty,
    UpdatePicture,
} from "@/lib/PartItemManager";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session) {
        const body = await request.json(); // Assuming the request body contains an "action" key
        switch (body.action) {
            case "updateQty":
                return UpdateQty(body);
            case "updatePartItem":
                return AddOrUpdatePartItem(body);
            case "uploadImagePartItem":
                return UpdatePicture(body);
            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
    }

    return NextResponse.error();
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (session) {
        return GetAllPartItems();
    }
    return NextResponse.error();
}
