import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import ExportLayout from "./_components/ExportLayout";

export default async function ProtectedRoute() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin");
    }

    return <ExportLayout />;
}
