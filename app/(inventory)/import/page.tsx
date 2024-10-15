import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import ImportLayout from "./_components/ImportLayout";

export default async function ProtectedRoute() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/api/auth/signin");
    }

    return <ImportLayout />;
}
