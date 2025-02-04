import React from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import FeedHeader from "../FeedHeader";
import ImageUpload from "@/components/common/Input/Upload/ImageUpload";
interface EditResourceProps {
    isOpen: boolean;
    onClose: () => void;
    zIndex?: number;
    header?: React.ReactNode;
    children?: React.ReactNode;
}

const EditResource = ({ isOpen, onClose, zIndex }: EditResourceProps) => {
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            zIndex={zIndex}
            centered
            footer={null}
            closeIcon={false}
            className="!p-0 !m-0 [&_.ant-modal-content]:!p-0"
            width="100%"
            style={{
                top: 0,
                margin: 0,
                padding: 0,
                borderRadius: 0,
                height: "100%",
                maxWidth: "100%",
            }}
            wrapClassName="!bg-[#F4F7FB]"
            bodyStyle={{
                padding: 0,
                background: "#F4F7FB",
            }}
        >
            <div className=" flex flex-col h-screen bg-[#F4F7FB]">
                <div className="bg-white p-4">
                    <FeedHeader title="Edit Post" onClose={onClose} onSave={() => {}} />
                </div>
                {/* Modal Content */}
                <div className="p-4 bg-[#F4F7FB]">
                    <div className="mt-4 bg-white p-4 rounded-[12px]">
                        <textarea
                            className="w-full h-[215px] p-3  border border-gray-300 rounded-lg bg-[#F4F7FB] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type what do you want to say..."
                        />
                    </div>
                    <div className="flex gap-2 flex-col mt-4 bg-white p-4 rounded-[12px]">
                        <h2 className="text-lg font-semibold">Upload Photos</h2>
                        <ImageUpload
                            // name="resource-image"
                            // inputType="upload"
                            // value={null}
                            // onChange={() => {}}
                            // variant="file"
                            // handleRemove={() => {}}
                            // handleClick={() => {}}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditResource;
