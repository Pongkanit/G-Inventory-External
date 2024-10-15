import { getServerSession } from "next-auth/next";
import { GetAllActivities, PostActivity } from "@/lib/ActivityManager";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (session) {
        return GetAllActivities();
    }
    return NextResponse.error();
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session) {
        return PostActivity(request);
    }
    return NextResponse.error();
}
