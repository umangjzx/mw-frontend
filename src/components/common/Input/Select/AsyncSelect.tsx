import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { convertToOptions, customStyles, getOptionValue } from "./helper";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import CreatableSelect from "react-select/creatable";
import { BiCaretDown } from "react-icons/bi";
import TagComponent from "../../Tag";
import { cn } from "@/utils/merge-class";

type BaseAsyncSelectProps = SelectInputProps & {
    variant: "multi" | "single";
    creatable?: boolean;
    endpoint: CommonPath;
    responseAsLabel: string;
    responseAsValue: string | string[] | "payload" | null;
    value: any;
    queryParams?: Record<string, any>;
    transformResponse?: (data: any) => any;
    onError?: (error: Error) => void;
};

type CreatableSelectProps = BaseAsyncSelectProps & {
    creatable: true;
    onCreate: (value: string) => void;
};

type AsyncSelectProps = BaseAsyncSelectProps | CreatableSelectProps;

const AsyncSelect = ({
    variant,
    creatable,
    endpoint,
    responseAsLabel,
    responseAsValue,
    queryParams = {},
    transformResponse,
    onError,
    ...props
}: AsyncSelectProps) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["async-select", props.name, endpoint, queryParams],
        queryFn: async () => {
            try {
                const response = await GET_API(endpoints.common(endpoint));
                return transformResponse ? transformResponse(response.data) : response.data;
            } catch (error) {
                onError?.(error as Error);
                throw error;
            }
        },
        enabled: !!endpoint && !!responseAsLabel && !!responseAsValue,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const handleChange = (value: any) => {
        if (!data) return;

        const valueKey: any = Array.isArray(responseAsValue) ? responseAsValue[0] : responseAsValue;

        if (variant === "multi") {
            console.log("value", value);
            // For multi-select, value will be an array of selected values
            const selectedItems = value.map((selectedValue: any) => selectedValue.value);

            // const transformedValues = selectedItems.map((item: any) =>
            //     getOptionValue(item, responseAsValue)
            // );
            props.onChange?.(selectedItems);
        } else {
            // For single select
            const selectedItem = data.find((d: any) => d[valueKey] === value);
            const transformedValue = selectedItem
                ? getOptionValue(selectedItem, responseAsValue)
                : null;
            props.onChange?.(transformedValue);
        }
    };

    const getValue = useMemo(() => {
        if (!data || !props.value) return variant === "multi" ? [] : undefined;

        const valueKey: any = Array.isArray(responseAsValue) ? responseAsValue[0] : responseAsValue;

        if (variant === "multi" && Array.isArray(props.value)) {
            // For multi-select, convert each value to its corresponding option value
            console.log("props.value", props.value);
            return convertToOptions(
                data.filter((d: any) => {
                    const values = props.value.map((v: any) => v[valueKey]);
                    return values.includes(d[valueKey]);
                }),
                responseAsValue,
                responseAsLabel,
                isLoading
            );
        }

        // For single select
        const matchingItem = data.find((d: any) => {
            const dValue = getOptionValue(d, responseAsValue);
            return dValue[valueKey] === props.value[valueKey];
        });
        return matchingItem ? matchingItem[valueKey] : undefined;
    }, [data, props.value, responseAsValue, variant]);

    // Add createOption handler
    const handleCreate = (inputValue: string) => {
        if (creatable && "onCreate" in props) {
            props.onCreate(inputValue);
        }
    };

    const options = useMemo(
        () => convertToOptions(data, responseAsValue, responseAsLabel, isLoading),
        [data, responseAsValue, responseAsLabel, isLoading]
    );
    console.log("getValue", getValue);
    return (
        <div className='flex flex-col gap-2'>
            <CreatableSelect
                {...props}
                isMulti={variant === "multi"}
                options={options}
                value={getValue}
                onChange={handleChange as any}
                onCreateOption={handleCreate}
                isLoading={isLoading}
                isClearable
                classNamePrefix='select'
                isDisabled={props.disabled}
                placeholder={props.placeholder || "Search and Select"}
                formatCreateLabel={inputValue => `Create "${inputValue}"`}
                hideSelectedOptions={variant === "multi"}
                loadingMessage={() => "Loading..."}
                styles={customStyles}
                components={{
                    DropdownIndicator: () => <BiCaretDown className='text-black mr-1' />,
                    ClearIndicator: () => null,
                    MultiValueContainer: () => null,
                }}
                backspaceRemovesValue={false}
            />
            <div className={cn("flex flex-wrap gap-1", getValue?.length > 0 ? "flex" : "hidden")}>
                {getValue?.map((item: any) => (
                    <TagComponent
                        key={item}
                        onClose={() =>
                            handleChange(getValue.filter((v: any) => v.value !== item.value))
                        }
                        text={item.label}
                        isClose={true}
                        className='!bg-black !text-white p-1 px-4'
                    />
                ))}
            </div>
        </div>
    );
};

export default AsyncSelect;
