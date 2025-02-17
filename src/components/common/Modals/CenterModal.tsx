import React from "react";
import { Modal, ModalProps } from "antd";
import Button from "../Button";
import { cn } from "@/utils/merge-class";
import ModalCloseIcon from "@/assets/icons/ModalCloseIcon";

const CenterModal: React.FC<CenterModalProps> = ({
    isOpen,
    onClose,
    title = "",
    topContent = "",
    titleColor = "#1a1a1a",
    width = 520,
    height,
    children,
    rootClassName = "",
    bodyClassName = "",
    customClassName = "",
    titleClassName = "",
    headerRootClassName = "",
    primaryActionProps,
    secondaryActionProps,
    loading = false,
    headerComponent,
    footerComponent,
    zIndex = 1000,
    hideFooter = false,
    hideCloseIcon = false,
    headerClassName = "",
    footerClassName = "",
}) => {
    const defaultButtonStyles = {
        primaryActionProps: {
            title: primaryActionProps?.title,
            shape: primaryActionProps?.shape ?? "round",
            btnVariant: primaryActionProps?.btnVariant ?? "secondary",
            size: primaryActionProps?.size ?? "small",
            ...primaryActionProps,
        },
        secondaryActionProps: {
            title: secondaryActionProps?.title,
            shape: secondaryActionProps?.shape ?? "round",
            btnVariant: secondaryActionProps?.btnVariant ?? "secondary",
            size: secondaryActionProps?.size ?? "small",
            ...secondaryActionProps,
        },
    };

    const buttons = [
        <Button key={1} {...defaultButtonStyles.secondaryActionProps} disabled={loading} />,
        <Button key={2} {...defaultButtonStyles.primaryActionProps} loading={loading} disabled={loading} />,
    ];

    const footer = footerComponent || <div className="w-full flex gap-3 justify-end">{buttons.filter((button) => button)}</div>;

    const header = headerComponent || title && (
            <div className={`flex gap-2 w-full flex-col items-start justify-between ${headerRootClassName}`}>
                <h2 className={`text-xl text-[${titleColor}] font-semibold ${titleClassName}`}>
                    {title}
                </h2>
                {topContent && topContent}
            </div>
    );

    const classNames: ModalProps["classNames"] = {
        footer: "!hidden",
        mask: "!bg-[#00000099]",
        content: "flex flex-col !rounded-none md:!rounded-2xl !p-0 !m-0",
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            zIndex={zIndex}
            width={width}
            className={`custom-modal max-md:!w-screen md:!max-w-[95vw] max-md:!max-w-none max-md:!m-0 [&_.ant-modal-close]:!bg-transparent ${customClassName}`}
            classNames={classNames}
            closeIcon={hideCloseIcon ? null : <ModalCloseIcon className="active:scale-90 transition-all duration-200" />}
            centered
            height={height}
            styles={{
                body: {
                    padding: 0,
                    height: height,
                },
            }}
        >
            <div className={cn("flex flex-col w-full h-full max-h-[100vh] max-w-screen md:max-h-[95vh] md:max-w-[95vw]", rootClassName)}>
                {header && <div className={cn("flex px-2 md:px-4 lg:px-6 py-2 md:py-4 lg:pt-5 border-b border-stroke flex-center", headerClassName)}>{header}</div>}
                {/* Modal Content */}
                <div className={`flex-1 px-2 md:px-4 lg:px-6 py-2 md:py-3 bg-white overflow-y-auto no-scrollbar md:max-h-[90vh] ${bodyClassName}`}>
                    {children}
                </div>
                {hideFooter || footer && <div className={cn("flex px-2 md:px-4 lg:px-6 py-2 md:py-4 border-t border-stroke flex-center", footerClassName)}>{footer}</div>}
            </div>
        </Modal>
    );
};

export default CenterModal;
