import * as React from "react";

const SvgIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.width || 40} height={props.height || 40} fill="none" viewBox="0 0 40 40">
        <g filter="url(#filter0_b_733_4974)">
            <rect width="40" height="40" fill="#fff" rx="20"></rect>
            <g clipPath="url(#clip0_733_4974)">
                <path
                    fill="#EF4444"
                    d="m28.78 17.05-5.832-5.834A4.14 4.14 0 0 0 20 9.996a4.14 4.14 0 0 0-2.947 1.22l-5.832 5.834a4.17 4.17 0 0 0 0 5.891l5.833 5.834A4.14 4.14 0 0 0 20 29.996c1.113 0 2.16-.434 2.947-1.22l5.832-5.835A4.14 4.14 0 0 0 30 19.996a4.14 4.14 0 0 0-1.22-2.946m-1.178 4.713-5.832 5.834c-.945.944-2.592.944-3.537 0L12.4 21.763a2.5 2.5 0 0 1 0-3.535l5.833-5.834A2.49 2.49 0 0 1 20 11.662c.668 0 1.296.26 1.768.732l5.833 5.834c.472.472.732 1.1.732 1.768a2.48 2.48 0 0 1-.732 1.767M21.25 23.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0m-2.083-3.333v-4.584a.833.833 0 1 1 1.667 0v4.584a.833.833 0 1 1-1.667 0"
                ></path>
            </g>
        </g>
        <defs>
            <clipPath id="clip0_733_4974">
                <path fill="#fff" d="M10 10h20v20H10z"></path>
            </clipPath>
            <filter
                id="filter0_b_733_4974"
                width="120"
                height="120"
                x="-40"
                y="-40"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="20"></feGaussianBlur>
                <feComposite
                    in2="SourceAlpha"
                    operator="in"
                    result="effect1_backgroundBlur_733_4974"
                ></feComposite>
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_backgroundBlur_733_4974"
                    result="shape"
                ></feBlend>
            </filter>
        </defs>
    </svg>
);

export default SvgIcon;
