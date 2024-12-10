type InputOption = {
    label: string;
    value: string | number;
    sublabel?: string;
};

interface FormField extends Omit<InputProps, "value" | "onChange"> {
    name: string;
    label?: string;
    inputType: InputProps["inputType"];
    placeholder?: string;
    options?: { label: string; value: string | number; sublabel?: string }[];
    required?: boolean;
    sublabel?: string;
    sublabelAlignment?: "right" | "bottom";
    variant?: "rating" | "cover" | "default" | "profile";
    maxFiles?: number;
    rows?: number;
}

type SublabelAlignment = "right" | "bottom";

type BaseInputProps = {
    label?: string;
    sublabel?: string;
    sublabelAlignment?: SublabelAlignment;
    name: string;
    required?: boolean;
    error?: string;
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
};

type MultiSelectInputProps = BaseInputProps & {
    inputType: "multiselect";
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    options: InputOption[];
    placeholder?: string;
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

type ImageFile = {
    url: string;
    file?: File;
};

type ImageUploadProps = BaseInputProps & {
    inputType: "image-upload";
    value: ImageFile[];
    onChange: (value: ImageFile[]) => void;
    maxFiles?: number;
    inputClassName?: string;
    variant?: "cover" | "default" | "profile";
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

type InputProps =
    | TextInputProps
    | TextAreaInputProps
    | SelectInputProps
    | MultiSelectInputProps
    | DatePickerInputProps
    | CheckboxInputProps
    | RadioInputProps
    | ImageUploadProps
    | MultiSelectInputProps
    | SearchInputProps;
