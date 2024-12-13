import { cn } from "@/utils/merge-class";

const EventCard = ({ title, time, onEventClick, style, className, status }: EventCardProps) => {
    const statusStyles = {
        accepted: {
            bg: "bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]",
            dot: "bg-[#15803D]",
        },
        pending: {
            bg: "bg-[#F4F7FB] border-[#E0E0E0] text-[#4F4F4F]",
            dot: "bg-[#4F4F4F]",
        },
        rejected: {
            bg: "bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]",
            dot: "bg-[#B91C1C]",
        },
    };

    const currentStyle = statusStyles[status as keyof typeof statusStyles] || statusStyles.pending;

    return (
        <div
            onClick={onEventClick}
            className={cn(
                "flex items-center p-[1px] justify-between w-full text-sm px-2 py-1 border",
                className,
                currentStyle.bg
            )}
        >
            <div className="flex items-center gap-2 truncate overflow-hidden">
                <span className={`w-2 h-2 rounded-full ${currentStyle.dot}`} />
                <span className="font-normal capitalize !text-sm truncate">{title}</span>
            </div>
            <span className="text-xs">{time}</span>
        </div>
    );
};

export default EventCard;
