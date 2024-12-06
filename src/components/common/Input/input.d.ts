export type InputOption = {
  label: string;
  value: string | number;
  sublabel?: string;
};

export type SublabelAlignment = 'right' | 'bottom';

export type BaseInputProps = {
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
};

export type TextInputProps = BaseInputProps & {
  inputType: 'text';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export type TextAreaInputProps = BaseInputProps & {
  inputType: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export type SelectInputProps = BaseInputProps & {
  inputType: 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  options: InputOption[];
  placeholder?: string;
};

export type MultiSelectInputProps = BaseInputProps & {
  inputType: 'multiselect';
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  options: InputOption[];
  placeholder?: string;
};

export type DatePickerInputProps = BaseInputProps & {
  inputType: 'datepicker';
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
};

export type CheckboxInputProps = BaseInputProps & {
  inputType: 'checkbox';
  value: boolean;
  onChange: (value: boolean) => void;
  placeholder?: string;
};

export type RadioVariant = 'default' | 'rating';

export type RadioInputProps = BaseInputProps & {
  inputType: 'radio';
  value: string | number;
  onChange: (value: string | number) => void;
  options: InputOption[];
  variant?: RadioVariant;
};

export type ImageFile = {
  url: string;
  file?: File;
};

export type ImageUploadProps = BaseInputProps & {
  inputType: 'image-upload';
  value: ImageFile[];
  onChange: (value: ImageFile[]) => void;
  maxFiles?: number;
};


export type InputProps =
  | TextInputProps
  | TextAreaInputProps
  | SelectInputProps
  | MultiSelectInputProps
  | DatePickerInputProps
  | CheckboxInputProps
  | RadioInputProps
  | ImageUploadProps
  | MultiSelectInputProps;
