import { getServerSession } from "next-auth/next";
import { BarcodeLayout } from "./_components/BarcodeLayout";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const BarcodeScanner = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/protected");
    }
    return (
        <BarcodeLayout />
    )
};

export default BarcodeScanner;
