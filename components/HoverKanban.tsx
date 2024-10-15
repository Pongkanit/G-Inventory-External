import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import KanbanTag from "./KanbanTag";
import { PartItem, PartItemData } from "@/models/PartItem";

type HoverCardProps = {
    name: string;
    Kanban: PartItemData | undefined;
};

const HoverKanban = ({ name, Kanban }: HoverCardProps) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="w-36 p-2"><p className="text-left truncate ... ">{name}</p></div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
                <KanbanTag Kanban={Kanban} />
            </HoverCardContent>
        </HoverCard>
    );
};
export default HoverKanban;
