"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";

export const LoginButton = () => {
    return (
        <Button
            onClick={() => signIn()}>
            Login
        </Button>
    );
};

export const LogoutButton = () => {
    return (
        <Button
            variant="ghost"
            onClick={() => signOut()}
        >
            Logout
        </Button>
    );
};

function AuthButtonFunc() {
    const { data: session } = useSession();
    if (session) {
        return <LogoutButton />;
    }
    return <LoginButton />;
}

export function AuthButton() {
    return <AuthButtonFunc />;
}

const CompanyProfile = () => {
    const [data, setData] = React.useState({ mainLogo: "" });
    React.useEffect(() => {
        fetch("/api/company")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);
    return (
        <>
            <div className="flex flex-col">
                <div>
                    <Image
                        src={data.mainLogo}
                        alt="Picture of the author"
                        width={234}
                        height={67}
                    />
                </div>
            </div>
        </>
    )
}

export default function Navigator() {
    const pathname = usePathname();
    // Function to check if the link is active
    const isActive = (href: string) => pathname === href;
    const { data: session } = useSession();
    const menus = [
        { name: "Home", href: "/" },
        { name: "Import", href: "/import" },
        { name: "Export", href: "/export" },
        { name: "Add New", href: "/partitem" },
    ]
    return (
        <div className="flex justify-between items-center">
            <CompanyProfile />
            <div className="flex flex-col gap-4">
                <div className="flex w-full justify-end">
                    <div className="w-fit">
                        <AuthButton />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    {menus.map((menu) => (<Button key={menu.name} variant={isActive(menu.href) ? "selected" : "secondary"} asChild>
                        <Link href={menu.href}>
                            {menu.name}
                        </Link>
                    </Button>))}

                </div>
            </div>
        </div>
    );
};
