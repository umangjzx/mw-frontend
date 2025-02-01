import { Drawer } from "antd";
import React from "react";

interface SideNavBarProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose?: () => void;
}

const MobileSideModal: React.FC<SideNavBarProps> = ({ children, isOpen, onClose }) => {
    return (
        <div>
            <Drawer
                placement="right"
                closable={false}
                onClose={onClose}
                open={isOpen}
                width={"100%"}
                bodyStyle={{ padding: 0 }}
            >
                {children}
            </Drawer>
        </div>
    );
};

export default MobileSideModal;