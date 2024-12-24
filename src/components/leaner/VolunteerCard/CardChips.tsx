import React from "react";

const CardChips = ({ label, value }: { label: string; value: string }) => {
    return (
        <div
            className="bg-[#E0E0E0] w-fit 2xl:max-w-[250px] max-w-[200px] px-2 py-[3px] text-sm text-gray-light font-medium rounded-full overflow-hidden whitespace-nowrap"
            title={`${label}: ${value}`}
        >
            <span className="truncate block">
                {label}: <span className="text-black">{value}</span>
            </span>
        </div>
    );
};

export default CardChips;
