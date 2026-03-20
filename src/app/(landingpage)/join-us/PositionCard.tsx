"use client";

import React from "react";

export interface PositionCardProps {
    title: string;
    description: string;
    responsibilities?: string[];
    selected?: boolean;
    onSelect?: () => void;
    children?: React.ReactNode;
}

const PositionCard: React.FC<PositionCardProps> = ({
    title,
    description,
    responsibilities,
    selected = false,
    onSelect,
    children,
}) => {
    const content = (
        <>
            <div className="flex flex-col gap-[20px]">
                <div className="flex items-center gap-2 md:gap-3">
                    <span
                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-gray-900" : "border-gray-300"
                            }`}
                    >
                        {selected && (
                            <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                        )}
                    </span>
                    <p className="text-[16px] md:text-[20px] font-medium text-[#000000]">
                        {title}
                    </p>
                </div>
                <div className="flex flex-col gap-[20px]">
                    <p className="text-[14px] md:text-[16px] leading-relaxed  text-[#4F4F4F]">
                        {description}
                    </p>
                    {responsibilities && responsibilities.length > 0 && (
                        <div>
                            <p className="text-[14px] md:text-[14px]  text-[#000000] mb-1">
                                Responsibilities may include:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-[14px] md:text-[14px] text-[#000000]">
                                {responsibilities.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {children && <div className="mt-2">{children}</div>}
        </>
    );

    if (onSelect) {
        return (
            <div
                role="button"
                tabIndex={0}
                onClick={onSelect}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect();
                    }
                }}
                className={`w-full text-left cursor-pointer select-none rounded-3xl ring-1 ring-inset px-4 sm:px-5 md:px-6 py-4 md:py-5 lg:py-6 bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 ${selected
                        ? "ring-gray-900 shadow-sm bg-gray-50"
                        : "ring-gray-200 hover:ring-gray-300"
                    }`}
            >
                {content}
            </div>
        );
    }

    return (
        <div className="mt-2 w-full min-w-0 rounded-3xl ring-1 ring-inset ring-gray-200 px-4 sm:px-5 md:px-6 py-4 md:py-5 lg:py-6 bg-white">
            {content}
        </div>
    );
};

export default PositionCard;
