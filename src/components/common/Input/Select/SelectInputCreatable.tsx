import { customStyles } from "./helper";
import CreatableSelect from "react-select/creatable";
import { BiCaretDown } from "react-icons/bi";
import TagComponent from "../../Tag";
import { useState, useEffect, useMemo } from "react";

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
    
    const [selectOptions, setSelectOptions] = useState(options);
    const isMultiSelect = variant === "multi";

    useEffect(() => {
        setSelectOptions(options);
    }, [options]);

    const filteredOptions = useMemo(() => {
        return isMultiSelect
            ? selectOptions.filter(option => !value?.includes(option?.value))
            : selectOptions;
    }, [selectOptions, value, isMultiSelect]);

    const selectedValue = useMemo(() => {
        return isMultiSelect
            ? value
            : selectOptions.find(option => option?.value === value);
    }, [selectOptions, value, isMultiSelect]);

    const handleCreate = (inputValue: string) => {
        setSelectOptions(prev => [...prev, { label: inputValue, value: inputValue }]);
        props.onCreate(inputValue);
    };

    const handleChange = (newValue: any) => {
        if (isMultiSelect) {
            onChange([...value, newValue?.value]);
        } else {
            onChange(newValue ? newValue?.value : null);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <CreatableSelect
                {...props}
                required={false}
                options={filteredOptions}
                value={selectedValue}
                onChange={handleChange}
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

            {isMultiSelect && (
                <div className='flex flex-wrap gap-1'>
                    {value?.map((item: any) => (
                        <TagComponent
                            key={item}
                            onClose={() => onChange(value.filter(v => v !== item))}
                            text={item.toString().replace(/_/g, " ")}
                            isClose={true}
                            className='!bg-black !text-white p-1 px-4'
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectInputCreatable;