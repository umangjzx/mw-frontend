import * as React from "react";

interface ShareIconProps {
    width?: number;
    height?: number;
}

const ShareIcon = ({ width = 64, height = 64 }: ShareIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 64 64"
    >
        <rect width="64" height="64" fill="#F0FAFF" rx="32"></rect>
        <g clipPath="url(#clip0_450_2252)">
            <path
                fill="#0078A5"
                d="M38 38.5c0 3.03-2.47 5.5-5.5 5.5h-7a5.51 5.51 0 0 1-5.5-5.5v-7c0-3.03 2.47-5.5 5.5-5.5.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5a2.5 2.5 0 0 0-2.5 2.5v7a2.5 2.5 0 0 0 2.5 2.5h7a2.5 2.5 0 0 0 2.5-2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5m5-13.45-4.42-4.59c-.58-.6-1.52-.62-2.12-.04s-.62 1.52-.04 2.12L39.75 26H33.5a5.51 5.51 0 0 0-5.5 5.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5a2.5 2.5 0 0 1 2.5-2.5h6.25l-3.33 3.46a1.5 1.5 0 0 0 2.16 2.08l4.39-4.56c1.37-1.36 1.37-3.59.02-4.93z"
            ></path>
        </g>
        <defs>
            <clipPath id="clip0_450_2252">
                <path fill="#fff" d="M20 20h24v24H20z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default ShareIcon;
