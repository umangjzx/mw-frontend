import { IoAddCircle } from "react-icons/io5";

type AddResourceCardProps = {
    handleClick?: () => void;
}

const AddResourceCard = ({ handleClick }: AddResourceCardProps) => {
    return (
        <div onClick={handleClick} className='w-full h-full min-h-[313px] bg-white cursor-pointer rounded-xl shadow-md border hover:opacity-80 transition-opacity duration-300 border-[#f7f7f7] flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <IoAddCircle size={40} />
                <span className='text-sm text-black font-medium'>Add New Resource</span>
            </div>
        </div>
    );
};

export default AddResourceCard;
