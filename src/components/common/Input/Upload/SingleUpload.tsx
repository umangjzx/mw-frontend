import Image from "next/image";
import { BiPlus } from "react-icons/bi";
import Button from "../../Button";

const SingleImageUpload = ({ ...props }: BaseUploaderProps) => {
    const { value, handleRemove, handleClick, isLoading } = props;
    const isImageFound = value?.image_url || value?.length > 0;

    return (
        <div className="w-full h-full bg-background-input p-2 rounded-xl border border-stroke flex items-center justify-between">
            <div className="relative w-24 h-24 group">
                {isImageFound ? (
                    <Image
                        src={value?.image_url || value[0]?.url}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                        width={96}
                        height={96}
                    />
                ) : (
                <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className="relative w-full h-full rounded-full flex items-center justify-center bg-stroke"
                >
                    {isLoading && (
                        <div className="absolute inset-0 w-full h-full border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    )}
                    <BiPlus className="text-2xl text-black bg-stroke rounded-full relative" />
                </button>
                )}
            </div>

            {isImageFound && (
                <div className="flex max-sm:flex-col items-center gap-2">
                    <Button
                        size="small"
                        loading={isLoading}
                        title={isLoading ? "Changing" : "Change"}
                        btnVariant="secondary"
                        disabled={isLoading}
                        customClassName="!text-xs !text-black !border-black !bg-white"
                        onClick={handleClick}
                    />
                    <Button
                        size="small"
                        title="Remove"
                        disabled={isLoading}
                        btnVariant="secondary"
                        customClassName="!text-xs !bg-white !border !border-error !text-red-500"
                        onClick={() => handleRemove(0, props.fileType)}
                    />
                </div>
            )}
        </div>
    );
};

export default SingleImageUpload;
