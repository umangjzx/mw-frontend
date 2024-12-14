type UploaderProps = UploadProps & {
    handleRemove: (index: number) => void;
    handleClick: () => void;
    isLoading?: boolean;
};
