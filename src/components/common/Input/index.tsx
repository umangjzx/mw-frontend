import React from "react";
import { Input as AntInput, Select, DatePicker, Checkbox } from "antd";
import RadioInput from "./RadioInput";
import ImageUpload from './ImageUpload';
import { BiCaretDown } from "react-icons/bi";
import { InputProps } from "./input";
import MultiSelect from "./MultiSelect";

const { TextArea } = AntInput;

export const Input: React.FC<InputProps> = (props) => {
    const {
        label,
        sublabel,
        sublabelAlignment = "bottom",
        name,
        required = false,
        error,
        disabled = false,
        className = "",
        labelClassName = "",
        inputClassName = "",
    } = props;

    const renderLabel = () => {
        if (!label) return null;

        const labelContent = (
            <div>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </div>
        );

        const sublabelContent = sublabel && (
            <p
                className={`text-xs text-gray-light mb-2 text-gray-500 font-normal
                ${sublabelAlignment === "right" ? "ml-2" : "mt-1"}`}
            >
                {sublabel}
            </p>
        );

        return (
            <label
                htmlFor={name}
                className={`text-sm font-medium text-gray-700 ${labelClassName}`}
            >
                <div
                    className={`flex ${
                        sublabelAlignment === "right" ? "items-center" : "flex-col items-start"
                    } gap-1`}
                >
                    {labelContent}
                    {sublabelContent}
                </div>
            </label>
        );
    };

    const renderInput = () => {
        switch (props.inputType) {
            case "text":
                return (
                    <AntInput
                        name={name}
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                        disabled={disabled}
                        className={`w-full text-sm p-2 rounded-md border-gray-300 hover:bg-background-input bg-background-input ${inputClassName}`}
                    />
                );

            case "textarea":
                return (
                    <TextArea
                        name={name}
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                        disabled={disabled}
                        className={`w-full text-sm p-2 rounded-md border-gray-300 hover:bg-background-input bg-background-input ${inputClassName}`}
                        rows={4}
                    />
                );

            case "select":
                return (
                    <Select
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.onChange}
                        disabled={disabled}
                        rootClassName="text-sm border hover:bg-background-input !bg-background-input border-stroke rounded-md"
                        className={`w-full text-sm h-fit rounded-md hover:bg-background-input bg-background-input ${inputClassName}`}
                        options={props.options}
                        suffixIcon={<BiCaretDown className="text-black" />}
                    />
                );

            case "multiselect":
                return (
                    <MultiSelect {...props} />
                );

            case "datepicker":
                return (
                    <DatePicker
                        name={name}
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={props.onChange}
                        disabled={disabled}
                        suffixIcon={<BiCaretDown className="text-black" />}
                        rootClassName="text-sm border-gray-300 bg-background-input rounded-md"
                        className={`w-full text-sm placeholder:text-sm hover:bg-background-input bg-background-input ${inputClassName}`}
                    />
                );

            case "checkbox":
                return (
                    <Checkbox
                        name={name}
                        checked={props.value}
                        onChange={(e) => props.onChange(e.target.checked)}
                        disabled={disabled}
                        className={inputClassName}
                    >
                        {props.placeholder}
                    </Checkbox>
                );

            case "radio":
                return <RadioInput {...props} />;

            case 'image-upload':
                return (
                    <ImageUpload
                        value={props.value}
                        onChange={props.onChange}
                        maxFiles={props.maxFiles}
                        disabled={disabled}
                    />
                );
        }
    };

    return (
        <div className={`mb-4 flex flex-col gap-1 ${className}`}>
            {renderLabel()}
            {renderInput()}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};
