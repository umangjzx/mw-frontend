type HeaderOptions = {
    actionButtonTitle?: string;
    actionButtonOnClick?: () => void;
    actionButtonClassName?: string;
    actionButtonPlacement?: "left" | "right";
    searchPlaceholder?: string;
    hideButton?: boolean;
    titleIcon?: React.ReactNode;
    title?: string;
    titleIconClick?: () => void;
} | null;

type UseVolunteerProps = {
    headerOptions: Partial<HeaderOptions>;
    setHeaderOptions: (options: HeaderOptions) => void;
};

type UseAppStoreProps = UseVolunteerProps;
