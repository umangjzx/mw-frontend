import React, { ChangeEvent } from "react";
import { cn } from "@/utils/merge-class";
import { Input as AntInput } from "antd";

interface CommentInputProps {
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    inputClassName: string;
    onPost: () => void;
}

const CommentInput = ({
    name,
    value,
    onChange,
    disabled,
    inputClassName,
    onPost,
}: CommentInputProps) => {
    return (
        <div className="bg-background-input border border-stroke flex items-center justify-between pr-4 !rounded-xl h-fit focus:!border-stroke focus:!bg-background-input ">
            <AntInput
                name={name}
                type="text"
                placeholder="Add your comment"
                value={value}
                onChange={onChange}
                disabled={disabled}
                rootClassName={cn(
                    inputClassName ? "w-[49%]" : "",
                    "border-none w-[90%] !rounded-xl h-fit focus:!border-stroke focus:!bg-background-input "
                )}
                className={cn(
                    `text-sm p-2 rounded-md hover:bg-background-input bg-background-input`,
                    inputClassName
                )}
            />
            <span
                className={`font-medium text-primary ${value ? "opacity-100" : "opacity-50"}`}
                onClick={onPost}
            >
                Post
            </span>
        </div>
    );
};

export default CommentInput;
