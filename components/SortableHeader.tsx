import React from "react";
import { HeaderContext } from "@tanstack/react-table";
import { toggleSorting } from "@/lib/CommonFunction";
import { Button } from "./ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface HeaderProps {
    column: HeaderContext<any, unknown>;
    name: string;
}

const SortableHeader: React.FC<HeaderProps> = ({ column, name }) => {
    return (
        <Button
            variant="ghost"
            size="xs"
            onClick={() => {
                toggleSorting(column);
            }}
        >
            {name}
            <CaretSortIcon />
        </Button>
    );
};

export default SortableHeader;
