type FeedbackModalProps = {
    isOpen: boolean;
    mode: "edit" | "create" | "view";
};

type AllEventsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    data: {
        events: any[];
        date: string;
    };
    onEventClick: (event: any) => void;
};

type AlertModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
    onCancel: () => void;
    value: string;
    onChange: (value: string) => void;
};