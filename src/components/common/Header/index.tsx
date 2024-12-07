    import { Input } from "../Input";

const CommonHeader: React.FC<CommonHeaderProps> = ({ title, titleIcon, searchOptions }) => {
    return (
        <div className='w-full h-full p-2 px-3 flex items-center justify-between'>
            <div className='flex capitalize items-center gap-2'>
                {titleIcon}
                <h1 className='text-lg font-semibold'>{title}</h1>
            </div>
            <Input
                inputType='search'
                name='search'
                inputClassName='!bg-transparent mt-3 rounded-full gap-1 items-center'
                className='!bg-transparent !w-fit'
                {...searchOptions as any}
            />
        </div>
    );
};

export default CommonHeader;
