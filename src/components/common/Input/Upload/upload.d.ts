type BaseUploaderProps = UploadProps & {
    handleRemove: (index: number) => void;
    handleClick: () => void;
    isLoading?: boolean;
};
