import * as React from "react";

const SvgIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 64 64">
        <rect width="64" height="64" fill="#fff" fillOpacity="0.3" rx="32"></rect>
        <g clipPath="url(#clip0_736_6571)">
            <path
                fill="url(#paint0_linear_736_6571)"
                d="M32 44c-6.617 0-12-5.383-12-12s5.383-12 12-12 12 5.383 12 12-5.383 12-12 12m0-22c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10m5 10a1 1 0 0 0-1-1h-3v-5a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1"
            ></path>
        </g>
        <defs>
            <linearGradient
                id="paint0_linear_736_6571"
                x1="20.51"
                x2="44.535"
                y1="20.108"
                y2="21.311"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#003966"></stop>
                <stop offset="0.5" stopColor="#322541"></stop>
                <stop offset="1" stopColor="#5E0817"></stop>
            </linearGradient>
            <clipPath id="clip0_736_6571">
                <path fill="#fff" d="M20 20h24v24H20z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default SvgIcon;
