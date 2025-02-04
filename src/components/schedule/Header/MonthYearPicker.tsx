import React, { useState, useEffect, useRef } from "react";
import { DatePicker, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { CalendarIcon } from "@/assets/icons";

const MonthYearPicker: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentMonth } = useAppStore();
  const [open, setOpen] = useState(false);
  const datePickerRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => {
    const urlDate = searchParams.get("current_month");
    return urlDate ? dayjs(urlDate) : dayjs();
  });

  const handleChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      const params = new URLSearchParams(searchParams.toString());
      params.set("current_month", date.format("YYYY-MM"));
      setCurrentMonth(date.format("YYYY-MM"));
      router.push(`?${params.toString()}`);
      setOpen(false); // Close the picker after selection
    }
  };

  useEffect(() => {
    if (!searchParams.get("current_month")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("current_month", selectedDate.format("YYYY-MM"));
      setCurrentMonth(selectedDate.format("YYYY-MM"));
      router.push(`?${params.toString()}`);
    }
  }, []);

  return (
    <div className="flex items-center relative">
      <DatePicker
        ref={datePickerRef}
        picker="month"
        format="YYYY-MM"
        value={selectedDate}
        onChange={handleChange}
        open={open}
        onOpenChange={setOpen}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />
      <Button
        onClick={() => setOpen(true)}
        className="text-sm bg-transparent font-medium rounded-full shadow-none flex items-center"
      >
        <CalendarIcon width="16" height="16" />
        {selectedDate.format("MMMM YYYY")}
      </Button>
    </div>
  );
};

export default MonthYearPicker;