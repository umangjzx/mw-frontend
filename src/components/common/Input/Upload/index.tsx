"use client";
import { ChangeEvent, useRef, useState } from "react";
import ImageUpload from "./ImageUpload";
import FileUpload from "./FileUpload";
import SingleImageUpload from "./SingleUpload";
import { useSendData } from "@/hooks/useReactQuery";
import { getFileData, handleConvertBasedOnContentType } from "./helper";
import { useAppStore } from "@/store/useAppStore";
import { DELETE_API } from "@/api/request";
import { endpoints } from "@/api/constants";

const Uploader = ({ maxFiles = 1, ...props }: UploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { imageId, setImageId, videoId, setVideoId, documentId, setDocumentId } = useAppStore();

    const handleSuccess = (data: any) => {
        const convertedData = handleConvertBasedOnContentType(data, props.fileType);
        if (maxFiles === 1) {
            if (props.fileType === "image/*") {
                setImageId(convertedData?.image_id);
            } else if (props.fileType === "video/*") {
                setVideoId(convertedData?.video_id);
            } else if (props.fileType === "application/*") {
                setDocumentId(convertedData?.document_id);
            }
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
            Array.from(files).map(async (file) => {
                console.log(file, "file image");
                return Promise.all([handleUpload(file)]);
            })
        );
    };

    const handleRemove = (index: number, type?: string) => {
        if (type === "image/*") {
            DELETE_API(endpoints.media_uploader.deleteImage(imageId as string)).then(() => {
                setImageId(null);
            });
        } else if (type === "video/*") {
            DELETE_API(endpoints.media_uploader.deleteVideo(videoId as string)).then(() => {
                setVideoId(null);
            });
        } else if (type === "application/*") {
            DELETE_API(endpoints.media_uploader.deleteDocument(documentId as string)).then(() => {
                setDocumentId(null);
            });
        }
        if (maxFiles === 1) {
            props.onChange(undefined);
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
        <div className="w-full h-fit">
            {renderUploader()}
            <input
                name={props.name}
                title={props.name}
                ref={fileInputRef}
                type="file"
                accept={props.fileType}
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={props.disabled || isPending}
                aria-hidden="true"
                tabIndex={-1}
            />
        </div>
    );
};

export default Uploader;
