import { FC, PropsWithChildren } from "react";

interface CardWrapperProps {
    title: string;
    index: number;
}

const CardWrapper: FC<PropsWithChildren<CardWrapperProps>> = ({ children, title, index }) => {
    return (
        <div className='bg-white lg:border border-stroke col-span-2 flex flex-col gap-4 w-full lg:rounded-[25px] py-3 lg:p-8'>
            <h2 className='text-xl lg:text-3xl font-medium lg:font-semibold mb-1 lg:mb-8'>
                {index + 1}. {title}
            </h2>
            <div className="grid grid-cols-2 w-full gap-6">
                {children}
            </div>
        </div>
    );
};

export default CardWrapper;
