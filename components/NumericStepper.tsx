import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
type NumericStepperProps = {
    init: any;
    onChange: any;
};
function NumericStepper({ init, onChange }: NumericStepperProps) {
    const [value, setValue] = useState(init);
    useEffect(() => {
        setValue(init);
    }, [init]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setValue(newValue);
    };

    const handleBlur = () => {
        onChange(value);
    };

    return (
        <Input
            type="number"
            name="points"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur} // Use onBlur to finalize changes
            step={1}
            min={1}
        />
    );
}

export default NumericStepper;
