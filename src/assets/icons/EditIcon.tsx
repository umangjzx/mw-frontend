import * as React from "react";

const EditIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='32'
    height='33'
    fill='none'
    viewBox='0 0 32 33'
  >
    <rect
      width='31.2'
      height='31.2'
      x='0.4'
      y='0.9'
      fill='#fff'
      fillOpacity='0.6'
      rx='15.6'
    ></rect>
    <rect
      width='31.2'
      height='31.2'
      x='0.4'
      y='0.9'
      stroke='#E0E0E0'
      strokeWidth='0.8'
      rx='15.6'
    ></rect>
    <g fill='#000' clipPath='url(#a)'>
      <path d='M21.858 13.007c-.015-.094-.166-.942-.78-1.561-.618-.604-1.47-.753-1.564-.768a.53.53 0 0 0-.364.073c-.038.023-.594.372-1.692 1.3.565.2 1.295.546 1.887 1.125.594.581.95 1.297 1.153 1.851.917-1.072 1.262-1.615 1.285-1.652a.54.54 0 0 0 .075-.368M16.507 12.886a58 58 0 0 0-2.002 1.9c-3.233 3.211-4.081 4.495-4.116 4.548a.53.53 0 0 0-.084.249l-.17 2.171a.534.534 0 0 0 .532.575q.02 0 .04-.002l2.188-.168a.54.54 0 0 0 .247-.083c.053-.034 1.345-.876 4.579-4.086a58 58 0 0 0 1.949-2.025c-.08-.347-.362-1.334-1.07-2.026-.717-.702-1.75-.978-2.093-1.053'></path>
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M9.6 10.1h12.8v12.8H9.6z'></path>
      </clipPath>
    </defs>
  </svg>
);

export default React.memo(EditIcon);
