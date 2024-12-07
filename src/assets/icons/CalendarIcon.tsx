const SvgIcon: React.FC<React.HTMLAttributes<HTMLOrSVGElement>> = props => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        fill='none'
        viewBox='0 0 20 20'
        {...props}
    >
        <g fill='currentColor' clipPath='url(#clip0_1031_8767)'>
            <path d='M15.833 1.667H15V.833a.833.833 0 1 0-1.667 0v.834H6.667V.833A.833.833 0 0 0 5 .833v.834h-.833A4.17 4.17 0 0 0 0 5.833v10A4.17 4.17 0 0 0 4.167 20h11.666A4.17 4.17 0 0 0 20 15.833v-10a4.17 4.17 0 0 0-4.167-4.166M1.667 5.833a2.5 2.5 0 0 1 2.5-2.5h11.666a2.5 2.5 0 0 1 2.5 2.5v.834H1.667zm14.166 12.5H4.167a2.5 2.5 0 0 1-2.5-2.5v-7.5h16.666v7.5a2.5 2.5 0 0 1-2.5 2.5'></path>
            <path d='M10 13.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M5.834 13.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M14.166 13.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5'></path>
        </g>
        <defs>
            <clipPath id='clip0_1031_8767'>
                <path fill='#fff' d='M0 0h20v20H0z'></path>
            </clipPath>
        </defs>
    </svg>
);

export default SvgIcon;
