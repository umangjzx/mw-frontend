import { Controller } from "react-hook-form";
import { Input } from "@/components/common/Input";
import type { Control } from "react-hook-form";
import type { LearnerFormData, VolunteerFormData } from "./config";

interface FormFieldProps {
    field: FormField;
    control: Control<VolunteerFormData | LearnerFormData>;
    errors: any;
    parent?: string | null;
}

export const FormField = ({ field, control, errors, parent }: FormFieldProps) => {

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
        return type === "error" ? errors[key]?.message : key;
    };

    return (
        <div className={`${field.gridCols === 2 ? "col-span-2" : "col-span-1"}`}>
            <Controller
                name={getFieldProperty(field, "name") as keyof VolunteerFormData}
                control={control}
                render={({ field: { onChange } }) => (
                    <Input
                        {...(field as any)}
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
