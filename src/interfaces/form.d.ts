type FormField = {
    id?: string;
    label?: string;
    inputType:
        | "text"
        | "select"
        | "radio"
        | "checkbox"
        | "datepicker"
        | "textarea"
        | "parent"
        | "multiselect"
        | "upload"
        | "search"
        | "async-select"
        | "contact-input";
    name?: string;
    placeholder?: string;
    required?: boolean;
    sublabel?: string;
    options?: { label: string; value: any }[];
    gridCols?: number;
    inputClassName?: string;
    parent?: string | null;
    disabled?: boolean;
    children?: FormField[];
    sublabelAlignment?: "right" | "bottom";
    title?: string;
    fileType?: string;
    endpoint?: string;
    responseAsLabel?: string;
    responseAsValue?: string[] | string;
    variant?: "multi" | "single";
} & Partial<BaseFormField>;

type BaseFormField = Omit<InputProps, "value" | "onChange" | "inputType"> & {
    name?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    sublabel?: string;
    sublabelAlignment?: "right" | "bottom";
    variant?: "rating" | "cover-image" | "default" | "profile-image" | "multi" | "single";
    maxFiles?: number;
    rows?: number;
    error?: any;
};

type FormSectionConfig = {
    title: string | null;
    fields: any[];
    type?: "card";
    parent?: string | null;
};
