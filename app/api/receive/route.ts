import { getServerSession } from "next-auth/next";
import { UpdateReceive } from "@/lib/ReceiveManager";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session) {
        return UpdateReceive(request);
    }
}
