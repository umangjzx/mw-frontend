type FeedbackModalProps = {
    isOpen: boolean;
    mode?: "view" | "edit" | "create";
    onClose: () => void;
    onSubmit: (data: any) => void;
    data: EventApi | null;
};

type AllEventsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    data: {
        events: any[];
        date: string;
        w?: any;
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

type AddNewMeetingModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type MyScheduleModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type ApprovalModalProps = {
    isOpen: boolean;
    onClose: () => void;
};
