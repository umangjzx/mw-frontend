import { FC, PropsWithChildren } from "react";

interface CardWrapperProps {
    title: string;
    index: number;
}

const CardWrapper: FC<PropsWithChildren<CardWrapperProps>> = ({ children, title, index }) => {
    return (
        <div className='bg-white border border-stroke col-span-2  flex flex-col gap-4 w-full rounded-[25px] p-8'>
            <h2 className='text-3xl font-semibold mb-8'>
                {index + 1}. {title}
            </h2>
            {children}
        </div>
    );
};

export default CardWrapper;
