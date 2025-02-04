import * as React from "react";

const DropDown: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='12'
    height='7'
    fill='none'
    viewBox='0 0 12 7'
  >
    <path
      fill='#000'
      d='M1.342.5h9.316a.834.834 0 0 1 .584 1.425l-4.65 4.65a.833.833 0 0 1-1.184 0l-4.65-4.65A.833.833 0 0 1 1.342.5'
    ></path>
  </svg>
);

export default React.memo(DropDown);
