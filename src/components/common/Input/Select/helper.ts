export const convertToOptions = (
    data: any[] | null,
    responseAsValue: string | string[] | "payload" | null,
    responseAsLabel: string,
    isLoading: boolean
): InputOption[] => {
    if (isLoading || !data) return [];

    return data.map((item: any) => ({
        label: item[responseAsLabel],
        value: getOptionValue(item, responseAsValue),
    }));
};

const getOptionValue = (item: any, responseAsValue: string | string[] | "payload" | null) => {
    if (responseAsValue === "payload") return item;
    if (responseAsValue === null) return item;
    if (Array.isArray(responseAsValue)) {
        const valueMap = new Map();
        responseAsValue.forEach(value => {
            valueMap.set(value, item[value]);
        });
        return Object.fromEntries(valueMap);
    }

    return item[responseAsValue];
};
