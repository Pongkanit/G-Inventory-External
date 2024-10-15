import { HeaderContext } from "@tanstack/react-table";

export function CapitalizeFirstLetter(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function extractImageUrl(cellContent: string | undefined) {
    let newUrl;
    if (cellContent) {
        // old for googleDrive
        const regex = /id=([\w-]+)/;
        const match = regex.exec(cellContent);

        // new for normal image url
        const newRegex = /=image\("([^"]*)"\)/;
        const newMatch = newRegex.exec(cellContent);
        if (match) {
            const fileId = match[1];
            newUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
        } else if (newMatch) {
            newUrl = newMatch[1];
        }
    }
    return newUrl;
}

export function toggleSorting({ column }: HeaderContext<any, unknown>) {
    if (column.getIsSorted() === "desc") {
        column.toggleSorting(false);
    } else if (column.getIsSorted()) {
        column.clearSorting();
    } else {
        column.toggleSorting(true);
    }
}

export function convertToDateObject(dateStr: string): Date {
    const [datePart, timePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split("/");
    const [time, modifier] = timePart.split(" ");
    const [hours, minutes, seconds] = time.split(":");

    // Convert 12-hour time to 24-hour time
    const hours24 =
        modifier.toLowerCase() === "pm"
            ? (parseInt(hours) % 12) + 12
            : parseInt(hours) % 12;

    // Construct a Date object
    return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours24,
        parseInt(minutes),
        parseInt(seconds)
    );
}

export function excelDateToJSDate(serial: number) {
    if (serial == 0) {
        return null;
    }
    const excelEpoch = new Date(1899, 12, 0);
    let jsDate = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
    if (jsDate instanceof Date && !isNaN(jsDate.getTime())) {
        return jsDate.toISOString().split("T")[0];
    }

    return null;
}
