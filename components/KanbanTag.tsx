import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { extractImageUrl } from "@/lib/CommonFunction";
import { PartItem, type PartItemData } from "@/models/PartItem";
import { Rubik } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
type KanbanCardProps = {
    Kanban: PartItemData | undefined;
};

const rubik = Rubik({
    subsets: ["latin"],
    weight: "400",
});

const KanbanTag = ({ Kanban }: KanbanCardProps) => {
    // Create an object with all keys set to empty strings
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [screen, setScreen] = useState({ width: 0, height: 0 });

    const [companyLogo, setCompanyLogo] = useState("");
    useEffect(() => {
        fetch("/api/company")
            .then((res) => res.json())
            .then((data) => setCompanyLogo(data.kanbanLogo));
    }, []);

    useEffect(() => {
        setImageUrl(extractImageUrl(Kanban?.picture));
    }, [Kanban]);

    useEffect(() => {
        const { innerWidth: width, innerHeight: height } = window;
        setScreen({ width, height });
    }, []);
    // Use the object to create a new instance of KanbanItem
    const mockupKanbanItem = new PartItem();
    if (!Kanban) {
        Kanban = mockupKanbanItem;
    }
    if (!screen.height || !screen.width) {
        return <div>Loading...</div>;
    }
    return (
        <div className={"h-[7cm] w-[10cm]"}>
            <ResizablePanelGroup
                direction="vertical"
                className="border border-black text-[9px]"
            >
                <ResizablePanel defaultSize={15}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={20} className="">
                            <div className="flex justify-center items-center border border-black h-full">
                                <Image
                                    src={companyLogo}
                                    alt="Picture of the author"
                                    width={48}
                                    height={48}
                                />
                            </div>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={50} className={`${rubik.className}`}>
                            <ResizablePanelGroup direction="vertical">
                                <ResizablePanel defaultSize={45}>
                                    <ResizablePanelGroup direction="horizontal">
                                        <ResizablePanel defaultSize={75} className="">
                                            <div className="border border-black flex justify-center items-center h-full px-2">
                                                <p className="">G-CODE</p>
                                            </div>
                                        </ResizablePanel>
                                        <ResizablePanel defaultSize={25} className="">
                                            <div className="border border-black bg-sky-200 flex justify-end items-center h-full px-2">
                                                <p className="text-[9px]">SKU</p>
                                            </div>
                                        </ResizablePanel>
                                    </ResizablePanelGroup>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={55} className="">
                                    <div className="border border-black bg-sky-400 h-full text-white flex justify-center items-center h-full px-2">
                                        <p className="">KANBAN SUPPLY</p>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={30}>
                            <ResizablePanelGroup direction="vertical">
                                <ResizablePanel defaultSize={45} className="">
                                    <div className="border border-black flex justify-center items-center h-full px-2">
                                        <p className="text-sky-600  line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.code_sku}
                                        </p>
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={55} className="">
                                    <div className="border border-black text-blue-500 flex justify-center items-center h-full px-2">
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.category}
                                        </p>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizablePanel defaultSize={9}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={20} className="">
                            <div
                                className={`${rubik.className} border border-black bg-sky-200 flex justify-start items-center h-full px-1`}
                            >
                                <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-sky-200">
                                    Item
                                </p>
                            </div>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={80} className="">
                            <div className="border border-black flex justify-start items-center h-full px-1">
                                <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                    {Kanban.product_name}
                                </p>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizablePanel defaultSize={9}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={20} className="">
                            <div
                                className={`${rubik.className} border border-black bg-sky-200 flex justify-start items-center h-full px-1`}
                            >
                                <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-sky-200">
                                    Thai Des.
                                </p>
                            </div>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={80} className="">
                            <div className="border border-black flex justify-start items-center h-full px-1">
                                <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                    {Kanban.description}
                                </p>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizablePanel defaultSize={36}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={20}>
                            <ResizablePanelGroup direction="vertical">
                                <ResizablePanel defaultSize={25} className="">
                                    <div
                                        className={`${rubik.className} border border-black bg-sky-200 flex justify-start items-center h-full px-1`}
                                    >
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-sky-200">
                                            Part No.
                                        </p>
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={25} className="">
                                    <div
                                        className={`${rubik.className} border border-black bg-sky-200 flex justify-start items-center h-full px-1`}
                                    >
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-sky-200">
                                            Min
                                        </p>
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={25} className="">
                                    <div
                                        className={`${rubik.className} border border-black bg-sky-200 flex justify-start items-center h-full px-1`}
                                    >
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-sky-200">
                                            Max
                                        </p>
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={25} className="">
                                    <div
                                        className={`${rubik.className} border border-black bg-sky-200 flex justify-start items-center h-full px-1`}
                                    >
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-sky-200">
                                            Unit
                                        </p>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={30} className="">
                            <ResizablePanelGroup direction="vertical">
                                <ResizablePanel defaultSize={25}>
                                    <div className="border border-black flex justify-start items-center h-full px-1">
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.part_no}
                                        </p>
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={25} className="">
                                    <div className="border border-black flex justify-start items-center h-full px-1">
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.min}
                                        </p>
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={25} className="">
                                    <div className="border border-black flex justify-start items-center h-full px-1">
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.max}
                                        </p>
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={25} className="">
                                    <div className="border border-black flex justify-start items-center h-full px-1">
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.unit}
                                        </p>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={50} className="">
                            <div className="border border-black flex items-center justify-center h-full">
                                {imageUrl ? (
                                    <div className="flex w-[96px] h-[96px] p-1">
                                        <Image
                                            src={imageUrl}
                                            alt="Kanban"
                                            height={128}
                                            width={128}
                                            className="object-contain"
                                            sizes="100vw"
                                        />
                                    </div>
                                ) : (
                                    <p>No image found</p>
                                )}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizablePanel defaultSize={9}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={50} className="">
                            <div
                                className={`${rubik.className} border border-black bg-sky-200 flex justify-center items-center h-full px-1`}
                            >
                                Inventory Location
                            </div>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={50} className="">
                            <div
                                className={`${rubik.className} border border-black bg-sky-200 flex justify-center items-center h-full px-1`}
                            >
                                Barcode
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizablePanel defaultSize={20}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={25} className="">
                            <ResizablePanelGroup direction="vertical">
                                <ResizablePanel defaultSize={40} className="">
                                    <div
                                        className={`${rubik.className} border border-black bg-sky-200 flex justify-center items-center h-full px-1`}
                                    >
                                        Rack
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={60}>
                                    <div className="border border-black flex justify-center items-center h-full px-1">
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.rack}
                                        </p>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={25} className="">
                            <ResizablePanelGroup direction="vertical">
                                <ResizablePanel defaultSize={40} className="">
                                    <div
                                        className={`${rubik.className} border border-black bg-sky-200 flex justify-center items-center h-full px-1`}
                                    >
                                        Shelf
                                    </div>
                                </ResizablePanel>
                                <ResizablePanel defaultSize={60}>
                                    <div className="border border-black flex justify-center items-center h-full px-1">
                                        <p className="text-[9px] line-clamp-1 hover:line-clamp-none hover:text-nowrap hover:absolute hover:bg-white">
                                            {Kanban.shelf}
                                        </p>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizablePanel defaultSize={50} className="">
                            <div className="border border-black flex justify-center items-center h-full px-2">
                                <div className="p-2 scale-90">
                                    <Barcode
                                        value={Kanban.code_sku || Kanban.part_no || " "}
                                        margin={0}
                                        format="CODE39"
                                        width={0.85}
                                        height={25}
                                        font="monospace"
                                        fontSize={12}
                                    />
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default KanbanTag;
