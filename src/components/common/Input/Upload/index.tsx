import { ChangeEvent, useRef } from "react";
import ImageUpload from "./ImageUpload";
import FileUpload from "./FileUpload";
import SingleImageUpload from "./SingleUpload";
import { useSendData } from "@/hooks/useReactQuery";
import { POST_API } from "@/api/request";
import { endpoints } from "@/api/constants";

const Uploader = ({ ...props }: UploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getImageData = async (baseImageString: string) => {
        let formData = new FormData();
        formData.append("image", baseImageString);
        const response = await POST_API(endpoints.common.mediaUploader, formData);
        return response;
    };

    const { mutate: handleUpload, isPending } = useSendData({
        fn: getImageData,
        success: () => {
            alert("Form submitted");
        },
        error: () => {
            alert("Error submitting form");
        },
        invalidateKey: ["onboarding"],
    });

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files?.length) return;

        const newFiles = await Promise.all(
            Array.from(files).map(async (file) => {
                console.log(file, "file image");
                const baseImageString = await convertToBase64(file);
                console.log(baseImageString, "baseImageString");
                return Promise.all([handleUpload(baseImageString)]);
            })
        );
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
        <div className="w-full h-fit">
            {renderUploader()}
            <input
                title={props.name}
                ref={fileInputRef}
                type="file"
                accept={props.fileType}
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={props.disabled}
            />
        </div>
    );
};

export default Uploader;
