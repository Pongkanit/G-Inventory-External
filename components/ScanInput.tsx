import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

interface ScanInputProps {
    onScan: (scannedInput: string) => boolean;
    isDisable: boolean;
}

const ScanInput: React.FC<ScanInputProps> = ({ onScan, isDisable }) => {
    const [localInput, setLocalInput] = React.useState("");
    const [isError, setIsError] = React.useState(false);

    const handleInputChange = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        if (event.target.value == "") {
            setIsError(false);
        }
        setLocalInput(event.target.value);
    };

    const handleButtonClick = async (e: { preventDefault: () => void; } | undefined) => {
        e!.preventDefault();
        const trimInput = localInput.trim();
        if (onScan(trimInput)) {
            setLocalInput("");
            setIsError(false);
        } else {
            setIsError(true);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleButtonClick(event);
        }
    };

    return (
        <div className="w-full">
            <div className="flex w-full space-x-2">
                <Input
                    className={isError ? "input-error" : ""}
                    type="text"
                    placeholder="Input barcode here"
                    value={localInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isDisable}
                />
                <Button
                    onClick={handleButtonClick}
                    disabled={isDisable}
                >
                    Scan
                </Button>
            </div>
        </div>
    );
};

export default ScanInput;
