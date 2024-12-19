import { useState } from "react";
import { Input } from "../Input";
import { Select } from "../Input/Select";

const mobileCountryCodes = [
    { label: "+1", value: "+1", phoneLength: 10 },
    { label: "+91", value: "+91", phoneLength: 10 },
    { label: "+86", value: "+86", phoneLength: 11 },
    { label: "+49", value: "+49", phoneLength: 10 },
    { label: "+81", value: "+81", phoneLength: 10 },
    { label: "+55", value: "+55", phoneLength: 11 },
    { label: "+33", value: "+33", phoneLength: 9 },
    { label: "+61", value: "+61", phoneLength: 9 },
    { label: "+27", value: "+27", phoneLength: 9 },
    { label: "+44", value: "+44", phoneLength: 10 }
];


const ContactInput = (props: ContactInputProps) => {
    const [errorMsg, setErrorMsg] = useState("");
    const formData = props.value;

    const handleChange = (value: any, name: string) => {
        const updatedFormData = { ...formData, [name]: value };
        props.onChange(updatedFormData);

        const actualLength = mobileCountryCodes.find(num => num?.label === updatedFormData?.country_code)?.phoneLength || 10;
        const message = actualLength != updatedFormData?.number.length ? `Phone Number Length Should be ${actualLength} digits`: ''
        setErrorMsg(message)
    };

    return (
        <>
            <div className='flex items-center gap-2'>
                <Select
                    name='country_code'
                    value={formData?.country_code || "+91"}
                    onChange={e => handleChange(e, "country_code")}
                    options={mobileCountryCodes}
                    inputType='select'
                    placeholder='+91'
                    className='!w-[10%] mb-0 mt-0 !h-full'
                    inputClassName='!w-[12%] mt-0 p-0 !mb-0'
                />
                <Input
                    name='number'
                    inputType='text'
                    placeholder='Phone Number'
                    className='!w-[88%] !mb-0'
                    value={formData?.number}
                    onChange={e => handleChange(e, "number")}
                />
            </div>
            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
        </>
    );
};

export default ContactInput;
