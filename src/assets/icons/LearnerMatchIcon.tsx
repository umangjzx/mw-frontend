import * as React from "react";

interface LearnerMatchIconProps {
    width?: number;
    height?: number;
}

const LearnerMatchIcon = ({ width = 64, height = 64 }: LearnerMatchIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 64 64"
    >
        <rect width="64" height="64" fill="#FFF5ED" rx="32"></rect>
        <g clipPath="url(#clip0_511_1923)">
            <path
                fill="#C62D08"
                d="m41.499 20-5 .002a2.507 2.507 0 0 0-2.499 2.5v6.852c.001 1.069 1.206 1.695 2.081 1.081l2.047-1.436H41.5a2.5 2.5 0 0 0 2.5-2.5v-4A2.5 2.5 0 0 0 41.499 20m.484 4.24-2.084 2.147a2.01 2.01 0 0 1-2.905-.015l-.769-.813a.998.998 0 1 1 1.451-1.373l.777.821 2.092-2.156a.999.999 0 1 1 1.437 1.39zM27.5 32c3.032 0 5.5-2.467 5.5-5.5S30.532 21 27.5 21a5.506 5.506 0 0 0-5.5 5.5c0 3.033 2.468 5.5 5.5 5.5m0 2c-4.136 0-7.5 3.364-7.5 7.5V43a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-1.5c0-4.136-3.364-7.5-7.5-7.5"
            ></path>
        </g>
        <defs>
            <clipPath id="clip0_511_1923">
                <path fill="#fff" d="M20 20h24v24H20z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default LearnerMatchIcon;
