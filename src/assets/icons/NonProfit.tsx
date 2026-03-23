import * as React from "react";

const NonProfit: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        {...props}
    >
        <g
            stroke="#EF4444"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.333"
            clipPath="url(#nonprofit-a)"
        >
            <path d="M2.567 5.747a2.667 2.667 0 0 1 3.186-3.18 2.667 2.667 0 0 1 4.494 0 2.667 2.667 0 0 1 3.187 3.186 2.666 2.666 0 0 1 0 4.494 2.667 2.667 0 0 1-3.18 3.186 2.667 2.667 0 0 1-4.5 0 2.666 2.666 0 0 1-3.187-3.18 2.667 2.667 0 0 1 0-4.506" />
            <path d="m6 8 1.333 1.333L10 6.667" />
        </g>
        <defs>
            <clipPath id="nonprofit-a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

export default React.memo(NonProfit);
