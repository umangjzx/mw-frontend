import React from "react";

interface ContainerWrapperProps {
    children: React.ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ children }) => {
    return (
        <div className="w-full max-w-[1400px] mx-auto bg-white flex flex-col gap-8 items-center justify-center p-[80px] rounded-3xl">
            {children}
        </div>
    );
};

export default ContainerWrapper;
