import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import KanbanTag from "./KanbanTag";
import { PartItem, PartItemData } from "@/models/PartItem";
import html2canvas from "html2canvas";
import { Button } from "./ui/button";
import { BarcodeImage } from "./Barcode";
import _ from "lodash";
type KanbanCardProps = {
    Kanban: PartItemData | undefined;
};

const PrintButton = ({ Kanban }: KanbanCardProps) => {
    const [isNew, setIsNew] = useState<boolean>(false); //Disable this if it's new part

    const contentToPrint = useRef(null);

    const prepareBarcodePrint = () => {
        const kanbanTag = document.getElementById("tmpBarcode");
        const printDiv = document.getElementById("thisPrint");
        if (printDiv?.firstChild) {
            printDiv.removeChild(printDiv.firstChild);
        }
        if (kanbanTag) {
            kanbanTag.classList.remove("hidden");
            html2canvas(kanbanTag).then(function (canvas) {
                const printDiv = document.getElementById("thisPrint");
                printDiv?.appendChild(canvas);
                kanbanTag.classList.add("hidden");
            });
        }
    };

    const prepareKanbanPrint = () => {
        const kanbanTag = document.getElementById("tmpKanban");
        const printDiv = document.getElementById("thisPrint");
        if (printDiv?.firstChild) {
            printDiv.removeChild(printDiv.firstChild);
        }
        if (kanbanTag) {
            kanbanTag.classList.remove("hidden");
            html2canvas(kanbanTag).then(function (canvas) {
                const printDiv = document.getElementById("thisPrint");
                printDiv?.appendChild(canvas);
                kanbanTag.classList.add("hidden");
            });
        }
    };
    const printKanban = useReactToPrint({
        documentTitle: "Kanban",
        onAfterPrint: () => {
            const printDiv = document.getElementById("thisPrint");
            if (printDiv?.firstChild) {
                printDiv.removeChild(printDiv.firstChild);
            }
        },
        removeAfterPrint: true,
    });

    React.useEffect(() => {
        if (Kanban) {
            if (_.isEqual(Kanban, new PartItem())) {
                setIsNew(true);
            } else {
                setIsNew(false);
            }
        }
    }, [Kanban]);

    return (
        <div>
            <div className={`${Kanban ? "" : "disable"}`}>
                <div className="flex justify-center items-center">
                    <div id="tmpBarcode" className="hidden">
                        <div className="flex flex-col items-center justify-center p-2 text-center text-[12px] border h-[4cm] w-[6cm]">
                        <BarcodeImage value={Kanban?.code_sku} />
                        <p>{Kanban?.product_name}</p>
                        </div>
                        
                    </div>
                    <div id="tmpKanban" className="hidden">
                        <KanbanTag Kanban={Kanban} />
                    </div>
                    <div id="thisPrint" className="absolute" ref={contentToPrint}></div>
                </div>
                <div className="flex justify-center items-center gap-4">
                    <div className="flex justify-between items-center gap-4">
                        <Button
                            disabled={isNew || !Kanban}
                            variant="selected"
                            className=""
                            onClick={() => {
                                prepareKanbanPrint();
                                const printDiv =
                                    document.getElementById("thisPrint");

                                // Start observing the target node
                                if (printDiv) {
                                    const observer = new MutationObserver(
                                        (mutations, obs) => {
                                            if (printDiv?.firstChild) {
                                                printKanban(
                                                    null,
                                                    () => contentToPrint.current
                                                );
                                                obs.disconnect();
                                            }
                                        }
                                    );
                                    const config = { childList: true };
                                    observer.observe(printDiv, config);
                                }
                            }}
                        >
                            Print Kanban
                        </Button>
                        <Button
                            disabled={isNew || !Kanban}
                            variant="selected"
                            onClick={() => {
                                prepareBarcodePrint();
                                const printDiv =
                                    document.getElementById("thisPrint");
                                // Start observing the target node
                                if (printDiv) {
                                    const observer = new MutationObserver(
                                        (mutations, obs) => {
                                            if (printDiv?.firstChild) {
                                                printKanban(
                                                    null,
                                                    () => contentToPrint.current
                                                );
                                                obs.disconnect();
                                            }
                                        }
                                    );
                                    // Specify what to observe: childList changes (additions or removals of children)
                                    const config = { childList: true };
                                    observer.observe(printDiv, config);
                                }
                            }}
                        >
                            Print Barcode
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PrintButton;
