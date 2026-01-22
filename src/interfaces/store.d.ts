type ActionButtons = {
    buttonTitle?: string;
    buttonOnClick?: () => void;
    buttonIcon?: React.ReactNode;
    buttonClassName?: string;
    showButton?: boolean;
    buttonPlacement?: "left" | "right";
}

type HeaderOptions = {
    actionButtonTitle?: string;
    actionButtonOnClick?: () => void;
    actionButtonClassName?: string;
    actionButtonVariant?: "primary" | "secondary" | "tertiary" | string;
    actionButtonIcon?: React.ReactNode;
    actionButtonPlacement?: "left" | "right";
    searchPlaceholder?: string;
    showTitleButton?: boolean;
    showButton?: boolean;
    hideSearch?: boolean;
    titleIcon?: React.ReactNode;
    title?: string;
    leftButton?: ActionButtons;
    actionButtons?: ActionButtons[];
    titleIconClick?: () => void;
    centerButton?: ActionButtons;
} | null;

type UseVolunteerProps = {
    volunteerTimeZone: string;
    setVolunteerTimeZone: (timezone: string) => void;
    volunteerUtcOffset: string;
    setVolunteerUtcOffset: (offset: string) => void;
    volunteerName: string;
    setVolunteerName: (name: string) => void;
    volunteerImage: string;
    setVolunteerImage: (image: string) => void;
    volunteerDetails: any;
    setVolunteerDetails: (data: object) => void;
};

type UseLearnerProps = {
    learnerTimeZone: string;
    setLearnerTimeZone: (timezone: string) => void;
    learnerUtcOffset: string;
    setLearnerUtcOffset: (offset: string) => void;
    learnerName: string;
    setLearnerName: (name: string) => void;
    learnerImage: string;
    setLearnerImage: (image: string) => void;
    learnerDetails: any;
    setLearnerDetails: (data: object) => void;
};

type UseGlobalStoreProps = {
    currentMonth: string;
    setCurrentMonth: (date: string) => void;
    eventDetails: any;
    setEventDetails: (details: any) => void;
    imageId: string | null;
    setImageId: (id: string | null) => void;
    videoId: string | null;
    setVideoId: (id: string | null) => void;
    documentId: string | null;
    setDocumentId: (id: string | null) => void;
};

type UseComponentStoreProps = {
    headerOptions: Partial<HeaderOptions>;
    setHeaderOptions: (options: HeaderOptions) => void;
};

type UseUserProps = {
    userName: string;
    setUserName: (userName: string) => void;
    userImage: string;
    setUserImage: (userImage: string) => void;
};

type UseAppStoreProps = UseUserProps & UseVolunteerProps & UseLearnerProps & UseGlobalStoreProps;
