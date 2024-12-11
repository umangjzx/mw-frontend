import { useQuery } from "@tanstack/react-query";
import MultiSelect from "./MultiSelect";
import Select from "./Select";
import axios from "axios";
import { convertToOptions } from "./helper";

type BaseAsyncSelectProps = SelectInputProps & {
    variant: "multi" | "single";
    creatable?: boolean;
    endpoint: string;
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


    // TODO: add debounce
    const { data, isLoading, error } = useQuery({
        queryKey: ["async-select", props.name, endpoint],
        queryFn: async () => {
            try {
                const response = await axios.get(endpoint, { params: queryParams });
                return response.data;
            } catch (error) {
                onError?.(error as Error);
                throw error;
            }
        },
        enabled: !!endpoint,
        throwOnError (error, query) {
            onError?.(error as Error);
            return true;
        },
    });

    const options = convertToOptions(data, responseAsValue, responseAsLabel, isLoading);

    const handleChange = (value: any) => {
        props.onChange?.(value);
    };

    const getValue = (value: any) => {
        if (Array.isArray(value)) {
            return options.filter(option => value.includes(option.value));
        }
        return options.find(option => option.value === value);
    }

    if (variant === "multi") {
        return (
            <MultiSelect
                {...props}
                onChange={handleChange}
                inputType='multiselect'
                options={options}
                value={getValue(props.value) as any || []}
                isLoading={isLoading}
                error={error ? "Failed to load options" : props.error}
            />
        );
    }

    return (
        <Select
            {...props}
            showSearch={true}
            isLoading={isLoading}
            options={options}
            value={getValue(props.value) as any || undefined}
            error={error ? "Failed to load options" : props.error}
            onChange={handleChange}
        />
    );
};

export default AsyncSelect;
