import * as React from "react";

interface CheckIconProps {
    className?: string;
}

const CheckIcon: React.FC<CheckIconProps> = ({ className = "" }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M13.3333 4L6 11.3333L2.66667 8"
            stroke="#22C55E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default CheckIcon;

