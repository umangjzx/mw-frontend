import { useState } from "react";
import { Input } from "../Input";
import { Select } from "../Input/Select";

const mobileCountryCodes = [
    { label: "+1", value: "+1", phoneLength: 10 },
    { label: "+91", value: "+91", phoneLength: 10 },
];

const ContactInput = (props: ContactInputProps) => {
    const [errorMsg, setErrorMsg] = useState("");
    const [maxNumberLength, setMaxNumberLength] = useState(10);
    const formData = props.value;
    const { disabled = false } = props;

    // Use form error only
    const displayError = props.error;

    const handleChange = (value: any, name: string) => {
        // Don't allow changes if disabled
        if (disabled) return;
        
        const updatedFormData = { ...formData, [name]: value } as any;

        if (name === "number") {
            const phoneNumber = value?.toString() || "";

            if (phoneNumber.length > 10) {
                return;
            }

            // Set validation status without local error messages
            updatedFormData.isValid = phoneNumber.length === 10;
        }

        props.onChange(updatedFormData);

        const actualLength =
            mobileCountryCodes.find((num) => num?.label === updatedFormData?.country_code)
                ?.phoneLength || 10;
        setMaxNumberLength(actualLength);
    };

    const preventExcessInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent all input if disabled
        if (disabled) {
            e.preventDefault();
            return;
        }
        
        const currentValue = formData?.number?.toString() || "";

        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(e.key)) {
            return;
        }

        if (currentValue.length >= 10) {
            e.preventDefault();
            setErrorMsg("Phone number cannot exceed 10 digits");
            return;
        }

        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
            return;
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <Select
                    name="country_code"
                    value={formData?.country_code }
                    onChange={(e) => handleChange(e, "country_code")}
                    options={mobileCountryCodes}
                    inputType="select"
                    placeholder="+91"
                    className="!w-[35%] md:!w-[20%] mb-0 mt-0 !h-full"
                    inputClassName="!w-[35%] md:!w-[20%] mt-0 p-0 !mb-0"
                    disabled={disabled}
                />
                <Input
                    name="number"
                    inputType="text"
                    placeholder="Enter Number Here"
                    className="!w-full !mb-0"
                    value={formData?.number || ""}
                    onChange={(e) => handleChange(e, "number")}
                    onKeyDown={preventExcessInput}
                    disabled={disabled}
                />
            </div>
            {/* {displayError && <p className="text-xs text-red-500 mt-1">{displayError}</p>} */}
            {formData?.number && formData.number.toString().length === 10 && !displayError && (
                <p className="text-xs text-green-500 mt-1">✓ Phone number is valid</p>
            )}
        </>
    );
};

export default ContactInput;
