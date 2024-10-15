"use client";
import KanbanTag from "@/components/KanbanTag";
import PrintButton from "@/components/PrintButton";
import ScanInput from "@/components/ScanInput";
import { Label } from "@/components/ui/label";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { fetchData } from "@/lib/CommonClientFunctions";
import {
	CapitalizeFirstLetter,
	convertToDateObject,
} from "@/lib/CommonFunction";
import type { Activity } from "@/models/Activity";
import { HealthStatus } from "@/models/Enum";
import { PartItem } from "@/models/PartItem";
import React, { useEffect } from "react";
// import { ActionButton } from "./ActionButton";
// import { ListActivities } from "./ListActivities";
import { ListPartItems } from "./ListPartItems";

export function BarcodeLayout() {
	// State
	const [fetch, setFetch] = React.useState<boolean>(false);
	const [partItemsData, setPartItemsData] = React.useState<PartItem[]>([]);
	const [activitiesData, setActivitiesData] = React.useState<Activity[]>([]);
	const [partItem, setPartItem] = React.useState<PartItem | undefined>();
	const [input, setInput] = React.useState("");

	// function
	const getItems = async () => {
		const rawData: PartItem[] = await fetchData("/api/items");
		const PartItems = rawData.map((item: PartItem) => new PartItem(item));

		const mappedPartItems = PartItems.map((item) => {
			const qty = Number(item.remaining_qty !== "" ? item.remaining_qty : 0);
			const min = Number(item.min !== "" ? item.min : 0);
			const max = Number(item.max !== "" ? item.max : 0);
			let status;
			if (qty >= max) {
				status = 4;
			} else if (qty > min * 1.25) {
				status = 3;
			} else if (qty > min * 0.75) {
				status = 2;
			} else {
				status = 1;
			}
			return { ...item, stockStatus: status };
		});

		const filteredPartItems = mappedPartItems.filter(
			(item) => item.remaining_qty !== "" && item.min !== "",
			// &&
			// Number(item.remaining_qty) <= Number(item.min) * 1.25
		);
		const sortedPartItems: PartItem[] = filteredPartItems.sort((a, b) => {
			return a.stockStatus - b.stockStatus;
		}) as PartItem[];
		setPartItemsData(sortedPartItems);
	};

	const getActivities = async () => {
		const activities = await fetchData("/api/activities");
		activities.sort((a: { date: string }, b: { date: string }) => {
			// Convert the date strings from 'dd/mm/yyyy, hh:mm:ss am/pm' to a Date object
			const dateObjA = convertToDateObject(a.date);
			const dateObjB = convertToDateObject(b.date);

			// Compare the dates
			return dateObjB.getTime() - dateObjA.getTime();
		});

		setActivitiesData(activities);
	};

	const handleScan = (scannedInput: React.SetStateAction<string>) => {
		const item = partItemsData.find(
			(item) => item.part_no === scannedInput || item.code_sku === scannedInput,
		);
		if (item) {
			setInput(scannedInput);
			return true;
		}
		return false;
	};

	const itemStatus = (input: PartItem | undefined) => {
		if (!input) {
			return <div>Checking</div>;
		}
		// Ensure currentStock is within bounds
		const qty = Number(input?.remaining_qty ?? 0);
		const min = Number(input?.min ?? 0);
		const max = Number(input?.max ?? 0);
		let status = "";
		let color = "";
		if (qty >= max) {
			status = CapitalizeFirstLetter(HealthStatus.Full);
			color = "font-bold text-blue-500";
		} else if (qty > min * 1.25) {
			status = CapitalizeFirstLetter(HealthStatus.Healthy);
			color = "font-bold text-green-500";
		} else if (qty > min * 0.75) {
			status = CapitalizeFirstLetter(HealthStatus.Poor);
			color = "font-bold text-yellow-500 animate-pulse";
		} else {
			status = CapitalizeFirstLetter(HealthStatus.Critical);
			color = "font-bold text-red-500 animate-pulse scale-110";
		}
		return (
			<div className="flex gap-2">
				<div className="">
					<Label>
						<div>
							<p className="text-center text-[10px]">Stock</p>
							<p className={`text-center text-xl font-bold ${color}`}>
								{partItem?.remaining_qty}
							</p>
						</div>
					</Label>
				</div>
				<div className="">
					<Label>
						<div>
							<p className="text-center text-[10px]">Status</p>
							<p className={`text-center text-xl font-bold ${color}`}>
								{status}
							</p>
						</div>
					</Label>
				</div>
			</div>
		);
	};

	// effect
	useEffect(() => {
		getItems();
		getActivities();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			getItems();
			getActivities();
		}, 5000);
		return () => clearTimeout(timer);
	}, [fetch]);
	useEffect(() => {
		if (partItem) {
			const item = partItemsData.find(
				(item) => item.part_no === input || item.code_sku === input,
			);
			setPartItem(item);
		}
	}, [partItemsData]);

	useEffect(() => {
		const item = partItemsData.find(
			(item) => item.part_no === input || item.code_sku === input,
		);
		setPartItem(item);
	}, [input]);

	return (
		<ResizablePanelGroup direction="horizontal" className="h-full">
			<ResizablePanel defaultSize={60}>
				<div className="pr-4">
					<ListPartItems
						kanbanData={partItemsData}
						setKanbanData={setPartItemsData}
						onClickItem={setInput}
					/>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={40}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={80} className="">
						<div className="flex justify-center items-center w-full p-4 gap-4">
							<div className="w-full">
								<ScanInput
									onScan={handleScan}
									isDisable={!partItemsData.length}
								/>
							</div>
							<div className="flex gap-4">
								{/* <ActionButton
                                    type={"Received"}
                                    partItem={partItem}
                                    fetch={fetch}
                                    setFetch={setFetch}
                                ></ActionButton>
                                <ActionButton
                                    type={"Removed"}
                                    partItem={partItem}
                                    fetch={fetch}
                                    setFetch={setFetch}
                                ></ActionButton> */}
							</div>
						</div>
						<div className="flex flex-col justify-center items-center w-full gap-4">
							<KanbanTag Kanban={partItem} />

							<div className="">{itemStatus(partItem)}</div>
							<PrintButton Kanban={partItem} />
						</div>
					</ResizablePanel>
					<ResizableHandle />
					{/* <ResizablePanel defaultSize={20}>
                        <ListActivities
                            activitiesData={activitiesData}
                            setActivitiesData={setActivitiesData}
                            items={partItemsData}
                        />
                    </ResizablePanel> */}
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
