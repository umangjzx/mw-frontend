import { useState } from "react";
import { Input } from "../Input";
import { Select } from "../Input/Select";

const mobileCountryCodes = [
    { label: "+1", value: "+1" },
    { label: "+91", value: "+91" },
    { label: "+86", value: "+86" },
    { label: "+49", value: "+49" },
    { label: "+81", value: "+81" },
    { label: "+55", value: "+55" },
    { label: "+33", value: "+33" },
    { label: "+61", value: "+61" },
    { label: "+27", value: "+27" },
    { label: "+44", value: "+44" }
];

const ContactInput = (props: ContactInputProps) => {
    const [formData, setFormData] = useState(props.value);

    const handleChange = (value: any, name: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
        props.onChange(formData);
    };

    return (
        <div className='flex items-center gap-2'>
            <Select
                name='country-code'
                value={formData?.country_code}
                onChange={e => handleChange(e, "country_code")}
                options={mobileCountryCodes}
                inputType='select'
                placeholder='+91'
                className='!w-[10%]'
                inputClassName='!w-[12%] h-fit mt-0 p-0 mb-4 '
            />
            <Input
                name='number'
                inputType='text'
                placeholder='Phone Number'
                className='!w-[88%]'
                value={formData?.number}
                onChange={e => handleChange(e, "number")}
            />
        </div>
    );
};

export default ContactInput;
