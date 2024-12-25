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
    actionButtonIcon?: React.ReactNode;
    actionButtonPlacement?: "left" | "right";
    searchPlaceholder?: string;
    showButton?: boolean;
    titleIcon?: React.ReactNode;
    title?: string;
    actionButtons?: ActionButtons[];
    titleIconClick?: () => void;
} | null;

type UseVolunteerProps = {
    volunteerName: string;
    setVolunteerName: (name: string) => void;
    volunteerImage: string;
    setVolunteerImage: (image: string) => void;
    volunteerDetails: object;
    setVolunteerDetails: (data: object) => void;
};

type UseLearnerProps = {
    learnerName: string;
    setLearnerName: (name: string) => void;
    learnerImage: string;
    setLearnerImage: (image: string) => void;
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

type UseAppStoreProps = UseVolunteerProps & UseLearnerProps & UseGlobalStoreProps;
