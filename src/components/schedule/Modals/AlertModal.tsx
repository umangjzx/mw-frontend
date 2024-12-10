import { Input } from "@/components/common/Input";
import CenterModal from "@/components/common/Modals/CenterModal";
import { alertModalConstants } from "@/constants/schedule";

const AlertModal = ({ isOpen, onClose, onProceed, onCancel, value, onChange }: AlertModalProps) => {

    return (
        <CenterModal
            topContent={<p className='text-sm'>{alertModalConstants.content}</p>}
            title={alertModalConstants.title}
            titleClassName='text-error'
            isOpen={isOpen}
            onClose={onClose}
            width='40%'
            customClassName="!rounded-3xl"
            secondaryActionProps={{
                onClick: onProceed,
                title: "Proceed",
                customClassName: "!rounded-xl hover:!bg-black hover:!text-white",
            }}
            primaryActionProps={{
                onClick: onCancel,
                title: "Cancel",
                btnVariant: "secondary",
                customClassName: "!bg-transparent !text-black !rounded-xl",
            }}
        >
            <Input
                placeholder={alertModalConstants.placeholder}
                inputType='textarea'
                name='notes'
                value={value}
                onChange={onChange}
                inputClassName='!rounded-lg'
                rows={alertModalConstants.rows}
            />
        </CenterModal>
    );
};

export default AlertModal;
