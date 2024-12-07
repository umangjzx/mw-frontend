import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Button from "@/components/common/Button";

interface Props {
    onChange?: (date: Dayjs) => void;
}

const MonthYearSlider: React.FC<Props> = ({ onChange }) => {
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

    const handleMonthChange = (direction: "prev" | "next") => {
        const newDate =
            direction === "prev" ? currentDate.subtract(1, "month") : currentDate.add(1, "month");

        setCurrentDate(newDate);
        onChange?.(newDate);
    };

    return (
        <div className='flex items-center'>
            <Button
                icon={<IoIosArrowBack className='text-xl' />}
                rootClassName='flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100'
                onClick={() => handleMonthChange("prev")}
            />

            <span className='text-xl font-medium min-w-[180px] text-center'>
                {currentDate.format("MMMM YYYY")}
            </span>

            <Button
                icon={<IoIosArrowForward className='text-xl' />}
                rootClassName='flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100'
                onClick={() => handleMonthChange("next")}
            />
        </div>
    );
};

export default MonthYearSlider;
