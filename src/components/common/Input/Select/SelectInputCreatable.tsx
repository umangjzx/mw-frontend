
import { customStyles } from "./helper";
import CreatableSelect from "react-select/creatable";
import { BiCaretDown } from "react-icons/bi";
import TagComponent from "../../Tag";

const SelectInputCreatable = ({
    value = [],
    onChange,
    options = [],
    disabled = false,
    placeholder = "Search and Select",
    className = "",
    isLoading = false,
    variant,
    ...props
}: MultiSelectInputCreatableProps) => {

    const isMultiSelect = variant === "multi";

    const handleCreate = (inputValue: string) => {
        props.onCreate(inputValue);
    };

    const handleChange = (newValue: any) => {
        onChange([...value, newValue?.value])
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <CreatableSelect
                {...props}
                required={false}
                options={isMultiSelect ? options.filter(option => !value?.includes(option?.value)) : value}
                value={value}
                onChange={isMultiSelect ? handleChange : onChange}
                onCreateOption={handleCreate}
                isLoading={isLoading}
                isClearable
                classNamePrefix="select"
                isDisabled={disabled}
                placeholder={placeholder || "Search and Select"}
                formatCreateLabel={(inputValue: string) => `Create - "${inputValue}"`}
                loadingMessage={() => "Loading..."}
                hideSelectedOptions={isMultiSelect}
                styles={customStyles}
                components={{
                    DropdownIndicator: () => <BiCaretDown className="text-black mr-1" />,
                    ClearIndicator: () => null,
                    MultiValueContainer: () => null,
                }}
                classNames={{
                    container: () => (props.inputClassName ? "w-[49%]" : "w-full"),
                }}
                backspaceRemovesValue={false}
            />
            <div className='flex flex-wrap gap-1'>
                {isMultiSelect && value.map(item => (
                    <TagComponent
                        key={item}
                        onClose={() => onChange(value.filter(v => v !== item))}
                        text={item.toString().replace(/_/g, " ")}
                        isClose={true}
                        className='!bg-black !text-white p-1 px-4'
                    />
                ))}
            </div>
        </div>
    );
};

export default SelectInputCreatable;
