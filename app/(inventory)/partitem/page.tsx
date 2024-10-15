import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import PartItemLayout from "./_components/PartItemLayout";

export default async function ProtectedRoute() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin");
    }

    return <PartItemLayout />;
}
