"use client";
import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";

interface TagComponentProps {
    text: string | null;
    isClose?: boolean;
}

const TagComponent = ({ text, isClose }: TagComponentProps) => {
    const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        console.log("Clicked! But prevent default.");
    };

    return (
        <Tag
            closeIcon={isClose ? true : false}
            onClose={preventDefault}
            className="bg-background text-black border-background font-medium text-[0.8rem] px-3 py-0.5 capitalize rounded-full"
        >
            {text}
        </Tag>
    );
};

export default TagComponent;
