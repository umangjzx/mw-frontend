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

    const handleChange = (value: any, name: string) => {
        const updatedFormData = { ...formData, [name]: value };

        if (name === "number") {
            const phoneNumber = value?.toString() || "";

            if (phoneNumber.length > 10) {
                return;
            }

           
            if (phoneNumber.length === 10) {
                setErrorMsg(""); 
            } else if (phoneNumber.length > 0) {
                setErrorMsg(`Phone number must be exactly 10 digits (${phoneNumber.length}/10)`);
            } else {
                setErrorMsg(""); 
            }
        }

        props.onChange(updatedFormData);

        const actualLength =
            mobileCountryCodes.find((num) => num?.label === updatedFormData?.country_code)
                ?.phoneLength || 10;
        setMaxNumberLength(actualLength);
    };

    const preventExcessInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
                    value={formData?.country_code}
                    onChange={(e) => handleChange(e, "country_code")}
                    options={mobileCountryCodes}
                    inputType="select"
                    placeholder="+91"
                    className="!w-[35%] md:!w-[20%] mb-0 mt-0 !h-full"
                    inputClassName="!w-[35%] md:!w-[20%] mt-0 p-0 !mb-0"
                />
                <Input
                    name="number"
                    inputType="text"
                    placeholder="Enter Number Here"
                    className="!w-full !mb-0"
                    value={formData?.number || ""}
                    onChange={(e) => handleChange(e, "number")}
                    onKeyDown={preventExcessInput}
                />
            </div>
            {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
        </>
    );
};

export default ContactInput;
