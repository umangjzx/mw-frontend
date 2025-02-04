import * as React from "react";

const MobileFlagIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <g clipPath="url(#a)">
            <path
                fill="#FEE2E2"
                d="m18.726 1.757 3.515 3.515a5.96 5.96 0 0 1 1.758 4.243v4.971c0 1.603-.624 3.11-1.758 4.243l-3.515 3.514A5.96 5.96 0 0 1 14.484 24H9.513a5.96 5.96 0 0 1-4.242-1.757l-3.515-3.515a5.96 5.96 0 0 1-1.758-4.243V9.514c0-1.603.624-3.11 1.758-4.243l3.515-3.514A5.96 5.96 0 0 1 9.513 0h4.971a5.96 5.96 0 0 1 4.242 1.757"
            ></path>
            <path
                stroke="#B91C1C"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.029"
                d="M8 18v-4.114m0 0V7.029A1.03 1.03 0 0 1 9.029 6h7.601a.686.686 0 0 1 .563 1.077L15.2 9.943l1.993 2.866a.685.685 0 0 1-.562 1.077z"
            ></path>
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default React.memo(MobileFlagIcon);
