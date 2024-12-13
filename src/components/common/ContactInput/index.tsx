import { useState } from "react";
import { Input } from "../Input";
import { Select } from "../Input/Select";

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
                options={[
                    {
                        label: "+91",
                        value: "+91",
                    },
                ]}
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
