
interface CenterModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    topContent?: string | React.ReactNode;
    titleColor?: string;
    width?: number | string;
    minWidth?: number | string;
    height?: number | string;
    minHeight?: number | string;
    children: React.ReactNode;
    customClassName?: string;
    titleClassName?: string;
    primaryActionProps?: ButtonProps;
    secondaryActionProps?: ButtonProps;
    hideFooter?: boolean;
}

interface ViewModalProps {
    modalOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: number | string;
    height?: number | string;
}
