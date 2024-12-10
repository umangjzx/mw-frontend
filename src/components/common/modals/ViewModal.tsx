import React from "react";
import { Modal } from "antd";

const ViewModal: React.FC<ViewModalProps> = ({
    modalOpen,
    onClose,
    children,
    width,
    height,
    style,
    className,
}) => {
    return (
        <Modal
            className={className}
            styles={{
                wrapper: {
                    zIndex: 1000,
                },
                content: {
                    padding: 0,
                    borderRadius: "1rem",
                },
                body: {
                    padding: 0,
                    height: height,
                },
            }}
            style={style}
            modalRender={node => (
                <div style={{ borderRadius: "12px", overflow: "hidden" }}>{node}</div>
            )}
            centered
            open={modalOpen}
            closeIcon={false}
            footer={null}
            width={width}
        >
            {children}
        </Modal>
    );
};

export default ViewModal;
