import * as React from "react";

const SeeMoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">
        <rect width="31" height="31" x="0.5" y="0.5" stroke="#E0E0E0" rx="15.5"></rect>
        <path
            fill="#000"
            d="m18.499 14.35-3.057-3.057a1 1 0 1 0-1.415 1.414l3.058 3.057a.333.333 0 0 1 0 .472l-3.058 3.057a1 1 0 1 0 1.415 1.414l3.057-3.057a2.337 2.337 0 0 0 0-3.3"
        ></path>
    </svg>
);

export default SeeMoreIcon;
