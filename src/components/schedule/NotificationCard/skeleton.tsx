const NotificationCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 border rounded-xl p-4 border-[#E0E0E0] h-fit w-[360px] animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-[40px] h-[40px] bg-gray-200 rounded-full" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>

            {/* Details */}
            <div className="flex gap-2 items-center justify-between">
                {/* Subject */}
                <div className="flex flex-col gap-1">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                {/* Date */}
                <div className="flex flex-col gap-1">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                {/* Time */}
                <div className="flex flex-col gap-1">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 w-full">
                <div className="h-9 w-full bg-gray-200 rounded-xl" />
                <div className="h-9 w-full bg-gray-200 rounded-xl" />
            </div>
        </div>
    );
};

export default NotificationCardSkeleton; 