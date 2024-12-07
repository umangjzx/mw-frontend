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
    customClassName = "",
    titleClassName = "",
    primaryActionProps,
    secondaryActionProps,
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
        <Button {...defaultButtonStyles.primaryActionProps} />,
        <Button {...defaultButtonStyles.secondaryActionProps} />,
    ];

    const footer = buttons.filter((button) => button);

    const header = title && (
        <div className="flex gap-2 w-full flex-col border-b border-stroke items-start justify-between mb-4 pb-4">
            <h2 className={`text-xl text-[${titleColor}] font-semibold ${titleClassName}`}>
                {title}
            </h2>
            {topContent && topContent}
        </div>
    );

    const classNames: ModalProps["classNames"] = {
        footer: "flex items-center justify-end",
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={footer}
            width={width}
            className={`custom-modal ${customClassName}`}
            classNames={classNames}
            closeIcon={
                <CloseOutlined className="text-gray-500 text-sm active:scale-90 transition-all duration-200" />
            }
            centered
            height={height}
        >
            <div className={`flex w-full h-full flex-col`}>
                {header}
                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto mb-4">{children}</div>
            </div>
        </Modal>
    );
};

export default CenterModal;
