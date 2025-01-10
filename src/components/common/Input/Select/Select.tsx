import { Select as AntSelect, Spin } from "antd";
import { BiCaretDown } from "react-icons/bi";

const Select = ({ disabled, inputType, inputClassName, isLoading, ...props }: SelectInputProps) => {
    if (inputType !== "select") return null;

    return (
        <AntSelect
            placeholder={props.placeholder}
            value={props.value || undefined}
            onChange={props.onChange}
            disabled={disabled}
            showSearch={props.showSearch}
            notFoundContent={<p className="text-center py-2 font-medium text-gray-700">{isLoading ? <Spin size="small" /> : "No Data"}</p>}
            rootClassName='text-sm border hover:bg-background-input !bg-background-input border-stroke rounded-md'
            className={`w-full text-sm h-fit rounded-md hover:bg-background-input bg-background-input ${inputClassName}`}
            options={props.options}
            suffixIcon={<BiCaretDown className='text-black' />}
        />
    );
};

export default Select;