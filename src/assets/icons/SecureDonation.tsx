import * as React from "react";

const SecureDonation: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        {...props}
    >
        <path
            stroke="#EF4444"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.333"
            d="M13.333 8.667c0 3.333-2.333 5-5.107 5.966a.67.67 0 0 1-.446-.006C5 13.667 2.667 12 2.667 8.667V4a.667.667 0 0 1 .666-.667c1.334 0 3-.8 4.16-1.813a.78.78 0 0 1 1.014 0c1.166 1.02 2.826 1.813 4.16 1.813a.667.667 0 0 1 .666.667z"
        />
    </svg>
);

export default React.memo(SecureDonation);
