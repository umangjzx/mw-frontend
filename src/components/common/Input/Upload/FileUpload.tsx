import Button from "../../Button";

const FileUpload = ({ ...props }: UploaderProps) => {
    const { handleClick, handleRemove, value = [] } = props;

    const getTitle = () => {
        if (props.fileType === "image/*") {
            return "Upload Image";
        } else if (props.fileType === "video/*") {
            return "Upload Video";
        } else if (props.fileType === "audio/*") {
            return "Upload Audio";
        }
        return "Upload Document";
    };

    return (
        <div className='flex w-full flex-wrap gap-4'>
            {value.length === 0 ? (
                <Button
                    size='small'
                    title={getTitle()}
                    btnVariant='secondary'
                    customClassName='!text-xs !text-white !border-black rounded-lg !bg-black'
                    onClick={handleClick}
                />
            ) : (
                value.map((file: File, index: number) => <div key={index}>{file.name}</div>)
            )}
            {value?.length > 0 && (
                <div className='flex items-center flex-row-reverse gap-2'>
                    <Button
                        size='small'
                        title='Change'
                        btnVariant='secondary'
                        customClassName='!text-xs !text-black !border-black !bg-white'
                        onClick={handleClick}
                    />
                    <Button
                        size='small'
                        title='Remove'
                        btnVariant='secondary'
                        customClassName='!text-xs !bg-white !border !border-error !text-red-500'
                        onClick={() => handleRemove(0)}
                    />
                </div>
            )}
        </div>
    );
};

export default FileUpload;
