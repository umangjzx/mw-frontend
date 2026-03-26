import * as React from "react";

const TaxDeductive: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='none'
    viewBox='0 0 16 16'
    {...props}
  >
    <path
      stroke='#EF4444'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.333'
      d='M10 1.333H4a1.333 1.333 0 0 0-1.333 1.334v10.666A1.333 1.333 0 0 0 4 14.667h8a1.333 1.333 0 0 0 1.333-1.334V4.667z'
    ></path>
    <path
      stroke='#EF4444'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.333'
      d='M9.334 1.333V4a1.333 1.333 0 0 0 1.333 1.333h2.667M6.667 6H5.334M10.667 8.667H5.334M10.667 11.333H5.334'
    ></path>
  </svg>
);

export default React.memo(TaxDeductive);
