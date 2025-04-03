import React, { ChangeEvent } from "react";
import { cn } from "@/utils/merge-class";
import { Input as AntInput } from "antd";

interface CommentInputProps {
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    loading?: boolean;
    disabled: boolean;
    inputClassName: string;
    onPost: () => void;
    onBlur?: () => void;
    onFocus?: () => void;
}

const CommentInput = ({
    name,
    value,
    onChange,
    loading,
    disabled,
    inputClassName,
    onPost,
    onBlur,
    onFocus,
}: CommentInputProps) => {
    return (
        <div className="flex bg-background-input border border-stroke items-center justify-between pr-4 !rounded-xl h-fit focus:!border-stroke focus:!bg-background-input">
            <AntInput
                name={name}
                type="text"
                placeholder="Add your comment"
                value={value}
                onChange={onChange}
                disabled={disabled}
                onBlur={onBlur}
                onFocus={onFocus}
                rootClassName={cn(
                    inputClassName ? "w-[49%]" : "",
                    "border-none w-[90%] !rounded-xl h-fit focus:!border-stroke focus:!bg-background-input"
                )}
                className={cn(
                    `text-sm p-2 rounded-md hover:bg-background-input bg-background-input`,
                    inputClassName
                )}
            />
            <button
                className={`font-medium text-primary ${value && !disabled ? "opacity-100" : "opacity-50"}`}
                onClick={onPost}
                disabled={!value || disabled}
            >
                {loading ? "Posting..." : "Post"}
            </button>
        </div>
    );
};

export default CommentInput;
