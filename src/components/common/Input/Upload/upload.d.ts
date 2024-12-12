type UploaderProps = ImageUploadProps & {
    handleRemove: (index: number) => void;
    handleClick: () => void;
};

interface UploadFile {
    url: string;
    file: File;
    base64?: string;
}
