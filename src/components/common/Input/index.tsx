import React from "react";
import {
    Input as AntInput,
    Checkbox,
    TimePicker,
    DatePicker as AntDatePicker,
    InputNumber,
} from "antd";
import { cn } from "@/utils/merge-class";
import { IoIosSearch } from "react-icons/io";
import RadioInput from "./RadioButton";
import Uploader from "./Upload";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncSelect, MultiSelect } from "./Select";
import { Select } from "./Select";
import ContactInput from "../ContactInput";
import dayjs from "dayjs";
import moment from "moment";
import SelectInputCreatable from "./Select/SelectInputCreatable";

const { TextArea } = AntInput;
const { RangePicker: DateRangePicker } = AntDatePicker;

const isAvailableDay = (date: any, availableDays: string[]) => {
    if (!availableDays || !Array.isArray(availableDays)) return true;
    const dayName = dayjs(date).format("dddd");
    return availableDays.includes(dayName);
};

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
    } = props;

    const renderLabel = () => {
        if (!label) return null;

        const labelContent = (
            <div className="max-lg:font-normal max-lg:text-sm">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </div>
        );

        const sublabelContent = sublabel && (
            <p
                className={`text-xs text-gray-light mb-2 text-gray-500 font-normal
                ${sublabelAlignment === "right" ? "!mb-0" : "mt-1"}`}
            >
                {sublabel}
            </p>
        );

        return (
            <label htmlFor={name} className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
                <div className={`flex ${sublabelAlignment === "right" ? "items-center" : "flex-col items-start"} gap-1`}>
                    {labelContent}
                    {sublabelContent}
                </div>
            </label>
        );
    };

    const preventInvalidInputForNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent 'e', 'E', '-', and '+' for numeric input
        if (["e", "E", "-", "+"].includes(event.key)) {
            event.preventDefault();
        }
    };

    const renderInput = () => {
        switch (props.inputType) {
            case "text":
                return (
                    <AntInput
                        name={name}
                        type={props.contentType}
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={(e) =>
                            props.onChange(
                                props?.responseType === "array" ? [e.target.value] : e.target.value
                            )
                        }
                        disabled={disabled}
                        rootClassName={cn(
                            props.inputClassName ? "w-[49%]" : "",
                            "hover:!border-stroke border h-fit focus:!border-stroke focus:!bg-background-input border-stroke"
                        )}
                        className={cn(
                            `text-sm p-2 rounded-md hover:bg-background-input bg-background-input`,
                            props.inputClassName
                        )}
                    />
                );
            case "number":
                return (
                    <InputNumber
                        {...props}
                        maxLength={props?.maxLength}
                        min={props?.min}
                        name={name}
                        type={props.inputType}
                        placeholder={props.placeholder}
                        value={props.value}
                        onChange={(value) => props.onChange(value)}
                        onKeyDown={preventInvalidInputForNumber}
                        disabled={disabled}
                        rootClassName={cn(
                            props.inputClassName ? "w-[49%]" : "",
                            "w-full !mb-0 border !border-stroke hover:!border-stroke h-fit focus:!border-stroke focus:!bg-background-input"
                        )}
                        className={cn(
                            props.inputClassName,
                            `!mb-0 text-sm p-[6px] rounded-md hover:!bg-background-input !bg-background-input`
                        )}
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
                        onKeyDown={(event) => props.onKeyDown ? props.onKeyDown(event) : event}
                        rootClassName={cn(
                            props.inputClassName,
                            `hover:!border-stroke border focus:!border-stroke focus:!bg-background-input border-stroke`
                        )}
                        className={cn(
                            props.inputClassName,
                            `w-full text-sm p-2 rounded-md hover:bg-background-input bg-background-input`
                        )}
                        rows={props.rows ?? 4}
                    />
                );

            case "search":
                return (
                    <AntInput
                        inputMode="search"
                        placeholder={props.placeholder}
                        onChange={(e) => props.onChange(e.target.value)}
                        value={props.value}
                        rootClassName={cn(
                            "hover:!border-stroke border focus:!bg-background-input !border-stroke w-full h-fit focus:!border-stroke focus:!bg-background-input border-stroke",
                            props.inputClassName
                        )}
                        className={cn(
                            props.inputClassName,
                            `w-full text-sm p-2 rounded-md hover:bg-background-input !bg-background-input`
                        )}
                        prefix={<IoIosSearch className="text-gray text-xl" />}
                    />
                );

            case "select":
                return <Select {...props} />;

            case "multiselect":
                return <MultiSelect {...props} />;
            
            case "select-creatable":
                return <SelectInputCreatable {...props} />;
        
            case "async-select":
                return <AsyncSelect {...props} />;
            case "datepicker":
                let today = new Date();
                today.setHours(0, 0, 0, 0);

                return (
                    <div>
                        <AntDatePicker
                            value={props.value ? dayjs(props.value) : null}
                            onChange={(date) => props.onChange(date?.toDate())}
                            format="YYYY-MM-DD"
                            disabledDate={(current) => {
                                // Check if date is before today
                                const isBeforeToday = current && current.isBefore(today, "day");

                                // Add more detailed logging
                                const currentDay = current?.format("dddd");
                                const isAvailable = props.availableDays?.includes(currentDay);

                                const isDayDisabled = props.availableDays
                                    ? !isAvailableDay(current, props.availableDays)
                                    : false;

                                return isBeforeToday || isDayDisabled;
                            }}
                            placeholder="Click to select date"
                            className={cn(
                                "w-full text-sm p-2 rounded-lg border border-stroke focus:!border-stroke focus:!bg-background-input placeholder:text-sm hover:bg-background-input bg-background-input",
                                props.inputClassName
                            )}
                        />
                    </div>
                );
            case "birthdatepicker":
                const { birthDatePicker } = props;
                const startDate = dayjs().subtract(birthDatePicker?.maxAge || 100, "year");
                const endDate = dayjs().subtract(birthDatePicker?.minAge || 0, "year");
                const disabledDate = (current: any) =>
                    current &&
                    (current.isBefore(startDate, "day") || current.isAfter(endDate, "day"));

                return (
                    <div>
                        <AntDatePicker
                            value={props.value ? dayjs(props.value) : null}
                            disabledDate={disabledDate}
                            onChange={(date, dateString) => props.onChange(dateString as string)}
                            format="YYYY-MM-DD"
                            allowClear={false}
                            placeholder="Click to select date"
                            className={cn(
                                "w-full text-sm p-2 rounded-lg border border-stroke focus:!border-stroke focus:!bg-background-input placeholder:text-sm hover:bg-background-input bg-background-input",
                                props.inputClassName
                            )}
                        />
                    </div>
                );
            case "checkbox":
                return (
                    <Checkbox
                        className={props.inputClassName}
                        name={name}
                        checked={props.value}
                        onChange={(e) => props.onChange(e.target.checked)}
                        disabled={disabled}
                    >
                        {props.children || props.placeholder}
                    </Checkbox>
                );

            case "radio":
                return <RadioInput {...props} />;

            case "upload":
                return <Uploader {...props} />;
            case "contact-input":
                return <ContactInput {...props} />;
            case "timerange":
                return (
                    <div className="flex items-center gap-2">
                        <TimePicker
                            name={`${name}-from`}
                            placeholder={props.fromPlaceholder || "From"}
                            value={props.value?.from}
                            onChange={(time) => {
                                let from = time;
                                let to = props.value?.to;
                                if (from && to && dayjs(from, "h:mm A").isAfter(dayjs(to, "h:mm A"))) [from, to] = [to, from];
                                props.onChange({ from, to });
                            }}
                            format="h:mm A"
                            use12Hours
                            disabled={disabled}
                        />
                        <span className="text-gray-500">to</span>
                        <TimePicker
                            name={`${name}-to`}
                            placeholder={props.toPlaceholder || "To"}
                            value={props.value?.to}
                            onChange={(time) => {
                                let from = props.value?.from;
                                let to = time;
                                if (from && to && dayjs(from, "h:mm A").isAfter(dayjs(to, "h:mm A"))) [from, to] = [to, from];
                                props.onChange({ from, to });
                            }}
                            format="h:mm A"
                            use12Hours
                            disabled={disabled}
                        />
                    </div>
                );
            case "daterange":
                return (
                    <DateRangePicker
                        {...props}
                        format="YYYY-MM-DD"
                        placeholder={["Start Date", "End Date"]}
                        onChange={(date) => props.onChange(date)}
                        disabledDate={(current) => current && current < moment().startOf('day')}
                    />
                );
        }
    };

    return (
        <div className={`mb-1 lg:mb-4 w-full h-auto flex flex-col gap-2 ${className}`}>
            {renderLabel()}
            {renderInput()}
            {error && <p className="text-xs text-red-500 capitalize">{error}</p>}
        </div>
    );
};
