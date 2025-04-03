import { Select as AntSelect, Spin } from "antd";
import { useMemo } from "react";
import { BiCaretDown } from "react-icons/bi";

const GroupedSelect = ({ disabled, inputType, inputClassName, isLoading, groupOptions, ...props }: SelectInputProps) => {
    if (inputType !== "grouped-select") return null;
    
    const groupedOptions = useMemo(() => groupOptions || props?.options || [], [groupOptions, props?.options]);
    return (
        <AntSelect
            placeholder={props?.placeholder}
            value={props?.value || undefined}
            onChange={props?.onChange}
            disabled={disabled}
            showSearch={props?.showSearch}
            notFoundContent={<p className="text-center py-2 font-medium text-gray-700">{isLoading ? <Spin size="small" /> : "No Data"}</p>}
            rootClassName='text-sm border hover:bg-background-input !bg-background-input border-stroke rounded-md'
            className={`w-full text-sm h-fit rounded-md hover:bg-background-input bg-background-input ${inputClassName}`}
            options={props?.options}
            suffixIcon={<BiCaretDown className='text-black' />}
            filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase()) ||
                option?.value?.toLowerCase().includes(input.toLowerCase())
            }
        >
            {groupedOptions.length > 0 && (
                groupedOptions.map((group: any) => (
                    <AntSelect.OptGroup label={group?.label} key={group?.label}>
                        {group?.options?.map((option: any) => (
                            <AntSelect.Option value={option?.value} key={option?.value}>
                                {option?.label}
                            </AntSelect.Option>
                        ))}
                    </AntSelect.OptGroup>
                ))
            )}
        </AntSelect>
    );
};

export default GroupedSelect;