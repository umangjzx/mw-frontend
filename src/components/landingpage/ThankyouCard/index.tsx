"use client";

import ThankyouIcon from "@/assets/icons/ThankyouIcon";
import isAuth from "@/components/auth/Auth";

type ThankyouCardProps = {
    title: string;
    description: string;
};

const ThankyouCard = ({ title, description }: ThankyouCardProps) => {
    return (
        <div className='bg-white max-w-[1040px] w-full mx-auto flex flex-col items-center justify-center gap-8 p-10 rounded-3xl'>
            <ThankyouIcon />
            <p className='text-[2.5rem] font-medium'>{title}</p>
            <p className='text-center text-xl mt-4'>{description}</p>
        </div>
    );
};

export default isAuth(ThankyouCard);
