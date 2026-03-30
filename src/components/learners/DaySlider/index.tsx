"use client";

import React from "react";
import dayjs from "dayjs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Button from "@/components/common/Button";

interface DaySliderProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

const DaySlider: React.FC<DaySliderProps> = ({ selectedDate, onDateChange }) => {
    const today = dayjs().format("YYYY-MM-DD");
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

    const isToday = selectedDate === today;
    const isTomorrow = selectedDate === tomorrow;

    const handlePrev = () => {
        if (!isToday) {
            onDateChange(today);
        }
    };

    const handleNext = () => {
        if (!isTomorrow) {
            onDateChange(tomorrow);
        }
    };

    const displayDate = dayjs(selectedDate).format("DD MMM YYYY");
    const label = isToday ? `Today (${displayDate})` : `Tomorrow (${displayDate})`;

    return (
        <div className="flex items-center gap-4">
            <Button
                icon={<IoIosArrowBack className="text-xl" />}
                onClick={handlePrev}
                disabled={isToday}
                rootClassName={`!w-10 !h-10 !p-0 flex items-center justify-center !rounded-full !bg-white !border !border-gray-200 transition-all ${isToday ? "opacity-50 cursor-not-allowed" : "hover:!bg-gray-50 active:scale-95"
                    }`}
            />
            <span className="text-[16px] md:text-[20px] font-medium text-[#121212] min-w-[150px] md:min-w-[200px] text-center">
                {label}
            </span>
            <Button
                icon={<IoIosArrowForward className="text-xl" />}
                onClick={handleNext}
                disabled={isTomorrow}
                rootClassName={`!w-10 !h-10 !p-0 flex items-center justify-center !rounded-full !bg-white !border !border-gray-200 transition-all ${isTomorrow ? "opacity-50 cursor-not-allowed" : "hover:!bg-gray-50 active:scale-95"
                    }`}
            />
        </div>
    );
};

export default DaySlider;
