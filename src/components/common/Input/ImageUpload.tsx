import React, { useRef } from "react";
import { ImageFile } from "./input.d";
import Image from "next/image";
import Button from "../Button";
import { BiPlus } from "react-icons/bi";

interface ImageUploadProps {
    value: ImageFile[];
    onChange: (files: ImageFile[]) => void;
    maxFiles?: number;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value = [],
    onChange,
    maxFiles = 10,
    disabled = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        const newFiles: ImageFile[] = Array.from(files).map(file => ({
            url: URL.createObjectURL(file),
            file,
        }));

        onChange([...value, ...newFiles].slice(0, maxFiles));
    };

    const handleRemove = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    return (
        <div className='flex flex-wrap gap-4'>
            {value.map((file, index) => (
                <div key={index} className='relative w-24 h-24 flex items-center justify-center group rounded-lg overflow-hidden'>
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
            {value.length < maxFiles && (
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className='w-24 h-24 border-2 group border-stroke !bg-transparent rounded-lg flex items-center justify-center text-gray hover:border-primary hover:text-primary transition-colors'
                >
                    <BiPlus className="text-2xl text-black bg-stroke rounded-full" />
                </Button>
            )}
            <input
                title='image_upload'
                ref={fileInputRef}
                type='file'
                accept='image/*'
                multiple
                onChange={handleFileChange}
                className='hidden'
                disabled={disabled}
            />
        </div>
    );
};

export default ImageUpload;
