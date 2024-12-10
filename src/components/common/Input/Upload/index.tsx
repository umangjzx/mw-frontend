import { ChangeEvent, useRef } from "react";
import ImageUpload from "./ImageUpload";
import FileUpload from "./FileUpload";
import SingleImageUpload from "./SingleUpload";

const Uploader = ({ ...props }: UploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files?.length) return;

        const newFiles = Array.from(files).map(file => ({
            url: URL.createObjectURL(file),
            file,
        }));

        if (props.variant === "profile-image" || props.maxFiles === 1 || props.variant === "file") {
            props.onChange([newFiles[newFiles.length - 1]]);
        } else {
            props.onChange([...props.value, ...newFiles].slice(0, props.maxFiles));
        }
    };

    const handleRemove = (index: number) => {
        const updatedFiles = [...props.value];
        updatedFiles.splice(index, 1);
        props.onChange(updatedFiles);
    };

    const renderUploader = () => {
        switch (props.variant) {
            case "file":
                return (
                    <FileUpload {...props} handleRemove={handleRemove} handleClick={handleClick} />
                );
            case "profile-image":
                return (
                    <SingleImageUpload
                        {...props}
                        handleRemove={handleRemove}
                        handleClick={handleClick}
                    />
                );
            case "cover-image":
            default:
                return (
                    <ImageUpload {...props} handleRemove={handleRemove} handleClick={handleClick} />
                );
        }
    };

    return (
        <div className='w-full h-fit'>
            {renderUploader()}
            <input
                title={props.name}
                ref={fileInputRef}
                type='file'
                accept={props.fileType}
                multiple
                onChange={handleFileChange}
                className='hidden'
                disabled={props.disabled}
            />
        </div>
    );
};

export default Uploader;
