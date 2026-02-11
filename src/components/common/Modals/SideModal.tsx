import ModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";
import { Drawer, Spin } from "antd";
import React, { useState } from "react";
import Divider from "../Divider";
import Button from "@/components/common/Button";

const SideModal: React.FC<SideModalProps> = ({
    children,
    title = "Some title",
    onClose,
    saveButtonText = "Save",
    cancelButtonText = "Cancel",
    onSave,
    onCancel,
    isOpen = false,
    isDisabled = false,
    isNeedButton = true,
    isLoading = false,
    modalWidth = 400,
    loading = false,
    hideHeaderDividerOnMobile = false,
}) => {
    return (
        <div>
            <Drawer
                placement="right"
                closable={false}
                onClose={onClose}
                open={isOpen}
                width={modalWidth}
                className=" bg-[#f4f7fb]"
                bodyStyle={{ padding: 0 }}
            >
                <div className="flex py-4 !px-0 flex-col h-full max-md:bg-[#f4f7fb]">
                    <div className="flex items-center md:justify-between justify-start gap-4 mb-3 md:px-5">
                        <h3 className="text-xl font-medium">{title}</h3>
                        <span onClick={onClose} className="cursor-pointer">
                            <ModalCloseIcon />
                        </span>
                    </div>
                    <Divider
                        className={hideHeaderDividerOnMobile ? "hidden md:block" : undefined}
                    />
                    {loading ? (
                        <div className="flex flex-col h-full justify-center items-center">
                            <Spin spinning={true} />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pb-2">{children}</div>
                    )}
                    {isNeedButton && (
                        <div className="mt-auto">
                            <Divider />
                            <div className="flex items-center justify-end gap-4 px-5 pt-4">
                                <Button
                                    onClick={onCancel}
                                    title={cancelButtonText}
                                    disabled={isLoading}
                                    className="w-fit px-4 py-2 !text-sm !text-black !bg-white !border !border-stroke-light rounded-xl"
                                />
                                <Button
                                    loading={isLoading}
                                    disabled={isDisabled}
                                    onClick={onSave}
                                    title={saveButtonText}
                                    className={`w-fit !text-sm px-4 py-2 !bg-black !text-white rounded-xl ${
                                        isDisabled
                                            ? "!bg-opacity-50 !bg-gray-light !cursor-not-allowed"
                                            : ""
                                    }`}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default SideModal;
