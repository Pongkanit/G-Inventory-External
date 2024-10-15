import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "@/models/Activity";
import { PartItem } from "@/models/PartItem";
import { Received } from "@/models/Received";
import { Remove } from "@/models/Remove";
import { useState } from "react";
interface ConfirmProps {
    type: string;
    partItem: PartItem | undefined;
    fetch: boolean;
    setFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ActionButton: React.FC<ConfirmProps> = ({
    type,
    partItem,
    fetch,
    setFetch,
}) => {
    const [qty, setQty] = useState("");
    const isRemoved = type == "Removed";
    const title = isRemoved ? "Removed" : "Received";
    const description = isRemoved
        ? "Remove item(s) from inventory"
        : "Add item(s) to inventory";

    const handleClick = () => {
        // Activity
        const activity = new Activity({
            date: new Date().toLocaleString(),
            item: partItem?.code_sku,
            item_name: partItem?.product_name,
            type: type,
            qty: qty.toString(),
            summary:
                type +
                " " +
                (partItem?.product_name ?? "") +
                " (" +
                (partItem?.code_sku ?? "") +
                ") total: " +
                qty,
        });
        activity.postData();

        // Removed or Received
        if (isRemoved) {
            const remove = new Remove({
                date: new Date().toLocaleString(),
                Code_sku: partItem?.code_sku,
                qty: qty,
            });
            partItem?.UpdateQty(-parseFloat(qty));
            remove.PostData();
        } else {
            const received = new Received({
                date: new Date().toLocaleString(),
                Code_sku: partItem?.code_sku,
                qty: qty,
            });
            received.PostData();
            partItem?.UpdateQty(parseFloat(qty));
        }

        setFetch(!fetch);
    };
    return (
        <Dialog>
            <DialogTrigger
                asChild
                disabled={!partItem}
                className={`${isRemoved ? "button-remove" : "button-receive"
                    }`}
            >
                <Button variant="outline">{title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{type}</DialogTitle>
                    <DialogDescription>
                        <p>{description}</p>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="totalNumber" className="text-right">
                            Total number
                        </Label>
                        <Input
                            id="totalNumber"
                            type="number"
                            placeholder="Input the number here"
                            defaultValue="0"
                            min="0"
                            className="col-span-3"
                            onChange={(event) => setQty(event.target.value)}
                            onKeyDown={(event) => {
                                // Prevent entering a minus sign
                                if (event.key === "-" || event.key === "e") {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            className={
                                isRemoved ? "button-remove" : "button-receive"
                            }
                            type="submit"
                            onClick={handleClick}
                        >
                            Save changes
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
