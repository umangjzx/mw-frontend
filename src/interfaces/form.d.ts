type FormField = {
    id?: string;
    label?: string;
    inputType:
        | "text"
        | "number"
        | "select"
        | "radio"
        | "checkbox"
        | "datepicker"
        | "birthdatepicker"
        | "textarea"
        | "parent"
        | "multiselect"
        | "select-creatable"
        | "upload"
        | "search"
        | "async-select"
        | "contact-input";
    name?: string;
    placeholder?: string;
    required?: boolean;
    sublabel?: string;
    showSearch?: boolean;
    creatable?: boolean;
    options?: { label: string; value: any }[];
    min?: number;
    gridCols?: number;
    inputClassName?: string;
    parent?: string | null;
    disabled?: boolean;
    children?: FormField[] | any;
    sublabelAlignment?: "right" | "bottom";
    title?: string;
    fileType?: string;
    endpoint?: string;
    responseType?: string;
    responseAsLabel?: string;
    responseAsValue?: string[] | string;
    birthDatePicker?: { minAge: number, maxAge: number };
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
