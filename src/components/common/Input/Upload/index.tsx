import { ChangeEvent, useRef } from "react";
import ImageUpload from "./ImageUpload";
import FileUpload from "./FileUpload";
import SingleImageUpload from "./SingleUpload";
import { useSendData } from "@/hooks/useReactQuery";
import { getFileData, handleConvertBasedOnContentType } from "./helper";

const Uploader = ({ maxFiles = 1, ...props }: UploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSuccess = (data: any) => {
        const convertedData = handleConvertBasedOnContentType(data, props.fileType);
        if (maxFiles === 1) {
            props.onChange(convertedData);
        } else {
            props.onChange([...props.value, convertedData]);
        }
    };

    const { mutate: handleUpload, isPending } = useSendData({
        fn: (file: any) => getFileData(file),
        success: handleSuccess,
        error: () => {
            alert("Error submitting form");
        },
    });

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files?.length) return;

        await Promise.all(
            Array.from(files).map(async file => {
                console.log(file, "file image");
                return Promise.all([handleUpload(file)]);
            })
        );
    };

    const handleRemove = (index: number) => {
        if (maxFiles === 1) {
            props.onChange(null);
        } else {
            const updatedFiles = [...props.value];
            updatedFiles.splice(index, 1);
            props.onChange(updatedFiles);
        }
    };

    const renderUploader = () => {
        switch (props.variant) {
            case "file":
                return (
                    <FileUpload
                        {...props}
                        handleRemove={handleRemove}
                        handleClick={handleClick}
                        isLoading={isPending}
                    />
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
                disabled={props.disabled || isPending}
            />
        </div>
    );
};

export default Uploader;
