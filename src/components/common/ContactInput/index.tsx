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
        props.onChange(updatedFormData);

        const actualLength = mobileCountryCodes.find(num => num?.label === updatedFormData?.country_code)?.phoneLength || 10;
        setMaxNumberLength(actualLength);
        const message = actualLength != updatedFormData?.number?.length ? `Phone Number Length Should be ${actualLength} digits`: ''
        setErrorMsg(message)
    };

    return (
        <>
            <div className='flex items-center gap-2'>
                <Select
                    name='country_code'
                    value={formData?.country_code}
                    onChange={e => handleChange(e, "country_code")}
                    options={mobileCountryCodes}
                    inputType='select'
                    placeholder='+91'
                    className='!w-[35%] md:!w-[20%] mb-0 mt-0 !h-full'
                    inputClassName='!w-[35%] md:!w-[20%] mt-0 p-0 !mb-0'
                />
                <Input
                    name='number'
                    inputType='number'
                    placeholder='Phone Number'
                    className='!w-full !mb-0'
                    maxLength={maxNumberLength}
                    value={parseInt(formData?.number)}
                    onChange={e => handleChange(e?.toString(), "number")}
                />
            </div>
            {/* {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>} */}
        </>
    );
};

export default ContactInput;
