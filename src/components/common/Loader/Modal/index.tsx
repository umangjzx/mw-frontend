import { Modal } from 'antd';
import React from 'react'
import { Spin } from "antd";

function ModalLoader({ isLoading, title }: { isLoading: boolean, title?: string }) {
  return (
    <Modal
        open={isLoading}
        footer={null}
        closable={false}
        centered
        zIndex={2000}
        classNames={{ content: "!bg-transparent !shadow-none" }}
    >
        <div className="w-full h-full flex-center flex-col gap-4">
            <Spin size="large" className="[&_.ant-spin-dot-item]:!bg-white" />
            <p className="text-white text-lg font-medium">{title}</p>
        </div>
    </Modal>
  )
}

export default ModalLoader;