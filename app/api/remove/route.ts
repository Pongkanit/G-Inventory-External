import { getServerSession } from "next-auth/next";
import { UpdateRemove } from "@/lib/RemoveManager";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session) {
        return UpdateRemove(request);
    }
}
