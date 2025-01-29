import * as React from "react";

const SideMenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || "24"}
    height={props.height || "24"}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="#000"
      d="M22.5 10.5h-21a1.5 1.5 0 0 0 0 3h21a1.5 1.5 0 0 0 0-3M1.5 6.5h21a1.5 1.5 0 0 0 0-3h-21a1.5 1.5 0 0 0 0 3M22.5 17.5h-21a1.5 1.5 0 0 0 0 3h21a1.5 1.5 0 0 0 0-3"
    ></path>
  </svg>
);

export default SideMenuIcon;
