import Barcode from "react-barcode";

interface BarcodeImageProps {
    value: string | undefined;
}

export const BarcodeImage: React.FC<BarcodeImageProps> = ({ value }) => {
    if (!value || value == "") {
        value = "0";
    }
    return <Barcode
        value={value}
        format="CODE39"
        margin={0}
        width={1.5}
        height={60}
        font="monospace"
        fontSize={12} />;
};
