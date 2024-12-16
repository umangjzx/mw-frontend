type HeaderOptions = {
    actionButtonTitle?: string;
    actionButtonOnClick?: () => void;
    actionButtonClassName?: string;
    actionButtonPlacement?: "left" | "right";
    searchPlaceholder?: string;
    showButton?: boolean;
    titleIcon?: React.ReactNode;
    title?: string;
    titleIconClick?: () => void;
} | null;

type UseVolunteerProps = {
    volunteerName: string;
    setVolunteerName: (name: string) => void;
};

type UseLearnerProps = {
    learnerName: string;
    setLearnerName: (name: string) => void;
};

type UseGlobalStoreProps = {
    currentMonth: string;
    setCurrentMonth: (date: string) => void;
    eventDetails: any;
    setEventDetails: (details: any) => void;
};

type UseComponentStoreProps = {
    headerOptions: Partial<HeaderOptions>;
    setHeaderOptions: (options: HeaderOptions) => void;
};

type UseAppStoreProps = UseVolunteerProps &
    UseLearnerProps &
    UseGlobalStoreProps &
    UseComponentStoreProps;
