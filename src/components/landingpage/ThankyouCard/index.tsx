"use client";

import ThankyouIcon from "@/assets/icons/ThankyouIcon";
import isAuth from "@/components/auth/Auth";

type ThankyouCardProps = {
    title: string;
    description: string;
    iconBgColor?: string;
    iconAccentColor?: string;
};

export const ThankyouCardBase = ({
    title,
    description,
    iconBgColor,
    iconAccentColor,
}: ThankyouCardProps) => {
    return (
        <div className='md:bg-white max-w-[1040px] w-full mx-auto flex flex-col items-center justify-center gap-8 p-10 rounded-3xl'>
            <ThankyouIcon bgColor={iconBgColor} accentColor={iconAccentColor} />
            <p className='text-2xl md:text-[2.5rem] font-medium text-center'>{title}</p>
            <p className='text-center text-base md:text-xl mt-4'>{description}</p>
        </div>
    );
};

export default isAuth(ThankyouCardBase);
