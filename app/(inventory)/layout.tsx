import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "@/app/globals.css";
import { getServerSession } from "next-auth";
import Navigator from "@/components/Navigator";
import SessionProvider from "@/lib/SessionProvider";

const ibm = IBM_Plex_Sans_Thai({
    subsets: ["latin", "thai"],
    weight: "400"
});

export const metadata: Metadata = {
    title: "SweetP Studio",
    description: "SweetP Studio",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();
    return (
        <html lang="en">
            <body className={`max-h-screen max-w-screen px-4 ${ibm.className}`}>
                <SessionProvider session={session}>
                    <div className="h-1/10">
                        <Navigator />
                    </div>
                    <div className="h-9/10">
                        {children}
                    </div>
                </SessionProvider>
            </body>
        </html>
    );
}
