import React from "react";
import { Modal, ModalProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Button from "../Button";

const CenterModal: React.FC<CenterModalProps> = ({
    isOpen,
    onClose,
    title = "",
    topContent = "",
    titleColor = "#1a1a1a", // default dark color
    width = 520,
    height,
    children,
    rootClassName = "",
    customClassName = "",
    titleClassName = "",
    primaryActionProps,
    secondaryActionProps,
    loading = false,
    headerComponent,
    footerComponent,
    zIndex = 1000,
    hideFooter = false
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
        <Button {...defaultButtonStyles.secondaryActionProps} />,
        <Button {...defaultButtonStyles.primaryActionProps} loading={loading} />,
    ];

    const footer = hideFooter || footerComponent || buttons.filter((button) => button);

    const header = headerComponent || title && (
            <div className="flex gap-2 w-full flex-col border-b border-stroke items-start justify-between mb-4 pb-4">
                <h2 className={`text-xl text-[${titleColor}] font-semibold ${titleClassName}`}>
                    {title}
                </h2>
                {topContent && topContent}
            </div>
    );

    const classNames: ModalProps["classNames"] = {
        footer: "flex items-center justify-end",
        mask: "!bg-[#00000099]",
        content: "md:!rounded-2xl !rounded-none",
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={footer}
            zIndex={zIndex}
            width={width}
            className={`custom-modal ${customClassName}`}
            classNames={classNames}
            closeIcon={
                <CloseOutlined className="hidden md:block text-gray-500 text-sm active:scale-90 transition-all duration-200" />
            }
            centered
            height={height}
            styles={{
                body: {
                    padding: 0,
                    height: height,
                },
            }}
        >
            <div className={`flex w-full h-full md:h-screen lg:h-full flex-col ${rootClassName}`}>
                {header}
                {/* Modal Content */}
                <div className="flex-1 max-md:pt-4 overflow-y-auto max-h-[93vh] bg-[#F4F7FB] md:bg-white md:max-h-[50vh] mb-4 no-scrollbar">
                    {children}
                </div>
            </div>
        </Modal>
    );
};

export default CenterModal;
