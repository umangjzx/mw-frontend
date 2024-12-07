const DayCellContent = ({ day, icon }: DayCellContentProps) => {
    return (
        <div className='flex gap-2 items-center space-y-1 py-2'>
            <div className='text-xl'>{icon}</div>
            <div className='text-sm text-gray-600'>{day}</div>
        </div>
    );
};

export default DayCellContent;
