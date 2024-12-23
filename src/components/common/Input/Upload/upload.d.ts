type BaseUploaderProps = UploadProps & {
    handleRemove: (index: number, type?: string) => void;
    handleClick: () => void;
    isLoading?: boolean;
};
