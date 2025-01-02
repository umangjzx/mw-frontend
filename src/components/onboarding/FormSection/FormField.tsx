import { Controller } from "react-hook-form";
import { Input } from "@/components/common/Input";
import type { Control } from "react-hook-form";
import type { LearnerFormData, VolunteerFormData } from "./config";

interface FormFieldProps {
    field: FormField;
    control: Control<VolunteerFormData | LearnerFormData>;
    errors: any;
    setValue: (name: string, value: any, options?: any) => void;
    parent?: string | null;
}

export const FormField = ({ field, control, setValue, errors, parent }: FormFieldProps) => {
    const getFieldValue = (field: any) => {
        if (parent) {
            const parentKey = parent.split(".");
            const value =
                parentKey?.length > 1
                    ? control._formValues?.[parentKey[0]]?.[parentKey[1]]
                    : control._formValues?.[parentKey[0]];
            return value?.[field?.id];
        }
        return control._formValues?.[field?.id];
    };

    const getFieldProperty = (field: any, type: "error" | "name") => {
        const key = parent ? `${parent}.${field.id}` : field.id;
        if (type === "error") {
            if (parent) {
                const parentKeys = parent.split(".");
                let currentErrors = errors;
                for (const parentKey of parentKeys) {
                    currentErrors = currentErrors?.[parentKey];
                }
                return currentErrors?.[field.id]?.message;
            }
            return errors?.[field.id]?.message;
        }
        return key;
    };

    const handleCreate = (newValue: any) => {
        const fieldName = getFieldProperty(field, "name");
        if(field.variant === "single") {
            return setValue(fieldName, newValue)
        }
        const currentValues = getFieldValue(field) || [];

        setValue(fieldName, [...currentValues, newValue], {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <div className={`${field.gridCols === 2 ? "col-span-2 w-full" : "col-span-1 w-full"}`}>
            <Controller
                name={getFieldProperty(field, "name")}
                control={control}
                render={({ field: { onChange } }) => (
                    <Input
                        {...(field as any)}
                        onCreate={handleCreate}
                        error={getFieldProperty(field, "error")}
                        value={getFieldValue(field)}
                        onChange={onChange}
                        name={getFieldProperty(field, "name") as keyof FormData}
                        inputClassName={field.inputClassName}
                        options={field.options}
                    />
                )}
            />
        </div>
    );
};
