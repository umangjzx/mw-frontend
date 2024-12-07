import { cn } from "@/utils/merge-class";

const EventCard = ({ title, time, onEventClick, style, className }: EventCardProps) => {
    return (
        <div
            onClick={onEventClick}
            className={cn("flex items-center p-[1px] justify-between w-full text-sm", className)}
            style={{ ...style, color: style?.textColor }}
        >
            <div className="flex items-center gap-2">
                <span
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: style?.textColor }}
                />
                <span className='font-normal'>{title}</span>
            </div>
            <span className='text-xs'>{time}</span>
        </div>
    );
};

export default EventCard;
