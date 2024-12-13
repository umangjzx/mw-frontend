import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

interface Props {
    onChange?: (date: Dayjs) => void;
    defaultDate?: string;
}

const MonthYearSlider: React.FC<Props> = ({ onChange, defaultDate }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setCurrentMonth } = useAppStore();

    // Initialize currentDate from props, URL, or default to current date
    const [currentDate, setCurrentDate] = useState<Dayjs>(() => {
        const urlDate = searchParams.get("current_month");
        return defaultDate ? dayjs(defaultDate) : urlDate ? dayjs(urlDate) : dayjs();
    });

    const handleMonthChange = (direction: "prev" | "next") => {
        const newDate =
            direction === "prev" ? currentDate.subtract(1, "month") : currentDate.add(1, "month");

        setCurrentDate(newDate);
        onChange?.(newDate);

        // Update URL with new date
        const params = new URLSearchParams(searchParams.toString());
        params.set("current_month", newDate.format("YYYY-MM"));
        setCurrentMonth(newDate.format("YYYY-MM"));
        router.push(`?${params.toString()}`);
    };

    // Update URL when component mounts
    useEffect(() => {
        if (!searchParams.get("current_month")) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("current_month", currentDate.format("YYYY-MM"));
            setCurrentMonth(currentDate.format("YYYY-MM"));
            router.push(`?${params.toString()}`);
        }
    }, []);

    return (
        <div className="flex items-center">
            <Button
                icon={<IoIosArrowBack className="text-lg" />}
                rootClassName="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
                onClick={() => handleMonthChange("prev")}
            />

            <span className="text-xl font-medium min-w-[180px] text-center">
                {currentDate.format("MMMM YYYY")}
            </span>

            <Button
                icon={<IoIosArrowForward className="text-lg" />}
                rootClassName="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
                onClick={() => handleMonthChange("next")}
            />
        </div>
    );
};

export default MonthYearSlider;
