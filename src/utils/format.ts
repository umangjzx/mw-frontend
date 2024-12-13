type ExtractLabelValueParams = {
    data: any[];
    labelKey: string;
    valueKey: string;
    additionalKeys?: Record<string, string>;
};

/**
 * Extracts label and value pairs from an array of objects
 * @param data - Array of objects to extract from
 * @param labelKey - Key to use as label in the resulting object
 * @param valueKey - Key to use as value in the resulting object
 * @param additionalKeys - Optional object mapping of additional keys to extract
 * @returns Array of objects with label, value and any additional key-value pairs
 */
export const extractLabelValue = ({
    data,
    labelKey,
    valueKey,
    additionalKeys = {},
}: ExtractLabelValueParams) => {
    return data.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
        ...Object.entries(additionalKeys).reduce(
            (acc, [key, sourceKey]) => ({
                ...acc,
                [key]: item[sourceKey],
            }),
            {}
        ),
    }));
};
