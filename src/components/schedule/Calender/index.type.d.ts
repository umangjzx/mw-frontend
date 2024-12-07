type EventCardProps = {
    title: string;
    time: string;
    onEventClick?: (event: any) => void;
    style?: any;
    className?: string;
};

type DayCellContentProps = {
    day: string;
    icon: string;
};

type ModalType = "events" | "alert" | null;