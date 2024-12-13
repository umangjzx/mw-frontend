type InputOption = {
    label: string;
    value: any;
    sublabel?: string;
};

type SublabelAlignment = "right" | "bottom";

type BaseInputProps = {
    label?: string;
    sublabel?: string;
    sublabelAlignment?: SublabelAlignment;
    name: string;
    required?: boolean;
    error?: any;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    contentType?: "number" | "text";
};

type TextInputProps = BaseInputProps & {
    inputType: "text";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

type TextAreaInputProps = BaseInputProps & {
    inputType: "textarea";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
};

type SelectInputProps = BaseInputProps & {
    inputType: "select";
    value: string | number;
    onChange: (value: string | number) => void;
    options: InputOption[];
    placeholder?: string;
    isLoading?: boolean;
    showSearch?: boolean;
};

type MultiSelectInputProps = BaseInputProps & {
    inputType: "multiselect";
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    options: InputOption[];
    placeholder?: string;
    isLoading?: boolean;
};

type DatePickerInputProps = BaseInputProps & {
    inputType: "datepicker";
    value: Date | null;
    onChange: (value: Date | null) => void;
    placeholder?: string;
};

type CheckboxInputProps = BaseInputProps & {
    inputType: "checkbox";
    value: boolean;
    onChange: (value: boolean) => void;
    placeholder?: string;
};

type RadioVariant = "default" | "rating";

type RadioInputProps = BaseInputProps & {
    inputType: "radio";
    value: string | number;
    onChange: (value: string | number) => void;
    options: InputOption[];
    variant?: RadioVariant;
};

type File = {
    url: string;
    file?: File;
};

type UploadProps = BaseInputProps & {
    inputType: "upload";
    value: File[];
    onChange: (value: File[]) => void;
    maxFiles?: number;
    inputClassName?: string;
    variant?: "cover-image" | "file" | "profile-image";
    fileType?: "image/*" | "application/*" | "video/*";
    error?: (error: Error) => void;
};

type SearchInputProps = BaseInputProps & {
    inputType: "search";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

type SingleImageUploadProps = Partial<ImageUploadProps> & {
    handleRemove: (index: number) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type TimeRangeValue = {
    from: string;
    to: string;
};

type BaseAsyncSelectProps = BaseInputProps & {
    inputType: "async-select";
    variant: "multi" | "single";
    creatable?: boolean;
    endpoint: CommonPath;
    responseAsLabel: string;
    responseAsValue: string | string[] | "payload" | null;
    onError?: (error: Error) => void;
    onChange: (value: any) => void;
    value: any;
    placeholder?: string;
};

type CreatableSelectProps = BaseAsyncSelectProps & {
    creatable: true;
    onCreate: (value: string) => void;
};

type AsyncSelectProps = BaseAsyncSelectProps | CreatableSelectProps ;


type ContactInputProps = BaseInputProps & {
    inputType: "contact-input";
    value: {
        country_code: string;
        number: string;
    };
    onChange: (value: { country_code: string; number: string }) => void;
};

type TimeRangeInputProps = BaseInputProps & {
    inputType: "timerange";
    onChange: (value: any) => void;
    fromPlaceholder?: string;
    toPlaceholder?: string;
    value: any
};

type InputProps =
    | TextInputProps
    | TextAreaInputProps
    | SelectInputProps
    | MultiSelectInputProps
    | DatePickerInputProps
    | CheckboxInputProps
    | RadioInputProps
    | UploadProps
    | MultiSelectInputProps
    | SearchInputProps
    | AsyncSelectProps
    | ContactInputProps
    | TimeRangeInputProps;
