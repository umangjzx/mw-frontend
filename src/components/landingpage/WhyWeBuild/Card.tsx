import React from "react";

interface CardProps {
    title: string;
    description: string;
    index: number;
}

const Card: React.FC<CardProps> = ({ index, title, description }) => {
    const backgroundLeft =
        "linear-gradient(to right, #ffe1cc, #ffdfd7, #fbe0e1, #f2e1e7, #eae3e9, #e8e3ea, #e6e4eb, #e4e4ec, #e1e4f1, #dce5f6, #d5e6fb, #cce8ff)";
    const backgroundRight =
        "linear-gradient(to left, #ffe1cc, #ffdfd7, #fbe0e1, #f2e1e7, #eae3e9, #e8e3ea, #e6e4eb, #e4e4ec, #e1e4f1, #dce5f6, #d5e6fb, #cce8ff)";

    return (
        <div
            className="max-w-[503px] w-full max-h-[283px] rounded-3xl flex flex-col justify-center p-6 gap-4"
            style={{
                background: index % 2 === 0 ? backgroundLeft : backgroundRight,
            }}
        >
            <p className="text-2xl font-medium">{title}</p>
            <p className="leading-relaxed">{description}</p>
        </div>
    );
};

export default Card;
