import React from "react";
import Image from "next/image";
import { BiPlus } from "react-icons/bi";
import { cn } from "@/utils/merge-class";
import Button from "../../Button";

const ImageUpload: React.FC<UploaderProps> = ({ ...props }) => {
    const { value = [], maxFiles = 1, disabled = false, handleRemove, handleClick } = props;

    return (
        <div
            className={cn(
                "flex w-full flex-wrap gap-4",
                props.variant === "cover-image" ? "!h-[250px]" : ""
            )}
        >
            {Array.isArray(value) &&
                value.map((file, index) => (
                    <div
                        key={index}
                        className={cn(
                            "relative flex items-center justify-center group rounded-lg overflow-hidden",
                            props.variant === "cover-image"
                                ? "h-[250px] active:!scale-100 w-full"
                                : "h-24 w-24"
                        )}
                    >
                        <Image
                            src={file.url}
                            alt={`Upload ${index + 1}`}
                            className='w-full absolute top-0 left-0 h-full object-cover'
                            width={400}
                            height={400}
                        />

                        <Button
                            size='small'
                            title='Remove'
                            btnVariant='secondary'
                            customClassName='transition-background max-w-full mx-2 group-hover:flex hidden !focus:bg-gray !hover:bg-gray bg-gray  z-50 p-0 !text-xs'
                            onClick={() => handleRemove(index)}
                        />
                        <div className='absolute bg-opacity-40 bg-black inset-0 text-white opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center'></div>
                    </div>
                ))}
            {value?.length < maxFiles && (
                <Button
                    onClick={handleClick}
                    disabled={disabled}
                    className={cn(
                        "w-24 h-24 border-2 group border-stroke !bg-transparent rounded-lg flex items-center justify-center text-gray hover:border-primary hover:text-primary transition-colors",
                        props.variant === "cover-image" ? "!h-[250px] active:!scale-100 w-full" : ""
                    )}
                >
                    <BiPlus className='text-2xl text-black bg-stroke rounded-full' />
                </Button>
            )}
        </div>
    );
};

export default ImageUpload;
