interface CenterModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    topContent?: string | React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    titleColor?: string;
    width?: number | string;
    minWidth?: number | string;
    height?: number | string;
    minHeight?: number | string;
    children: React.ReactNode;
    rootClassName?: string;
    bodyClassName?: string;
    headerRootClassName?: string;
    customClassName?: string;
    titleClassName?: string;
    childrenClassName?: string;
    primaryActionProps?: ButtonProps;
    secondaryActionProps?: ButtonProps;
    hideFooter?: boolean;
    loading?: boolean;
    zIndex?: number;
}

interface ViewModalProps {
    modalOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
    className?: string;
    borderRadius?: string;
}

interface SideModalProps {
    children: React.ReactNode;
    title?: string;
    onClose: () => void;
    saveButtonText?: string;
    cancelButtonText?: string;
    onSave?: () => void;
    onCancel?: () => void;
    isOpen?: boolean;
    isDisabled?: boolean;
    isNeedButton?: boolean;
    isLoading?: boolean;
    modalWidth?: number | string;
}

type ShowModalType = "view" | "edit" | "create" | null;
