type EventCardProps = {
    title: string;
    time: string;
    onEventClick?: (event: any) => void;
    className?: string;
    status?: string;
    style?: any;
};

type DayCellContentProps = {
    day: string;
    icon?: string;
};

type ModalType = "events" | "alert" | "feedback" | null;
