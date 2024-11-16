"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GetAPI, PostAPI } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const BookSession = () => {
  const params = useParams();
  const { id } = params;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  // Get current date for minimum selectable date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchAvailableSlots = async () => {
    const formattedDate = selectedDate
      ? moment(selectedDate).format("YYYY-MM-DD")
      : "";
    console.log(formattedDate, "formattedDate");
    return await GetAPI(
      endpoints.volunteer_slot.availableSlots(id as string, formattedDate)
    ).then((res: any) => {
      console.log(res.data, "res available slots");
      setAvailableSlots(res.data.slots);
      return res.data;
    });
  };

  //   const { data: availableSlots, isLoading } = useQuery({
  //     queryKey: ["availableSlots", id, selectedDate],
  //     queryFn: fetchAvailableSlots,
  //   });

  console.log(availableSlots.length, "availableSlots");

  const handleBookSession = async () => {
    if (
      !selectedSlot ||
      !selectedDate ||
      !sessionTitle ||
      !sessionDescription
    ) {
      alert("Please fill in all required fields");
      return;
    }
    const bookingData = {
      volunteer_id: id as string,
      volunteer_slot_id: selectedSlot.volunteer_slot_id,
      session_date: moment(selectedDate).format("YYYY-MM-DD"),
      session_time: selectedSlot.start_time,
      session_title: sessionTitle,
      session_description: sessionDescription,
    };
    try {
      const response = await PostAPI(
        endpoints.session.bookSession,
        bookingData
      );
      if (response.success) {
        alert("Session booked successfully!");
        // Reset form
        setSelectedSlot(null);
        setSessionTitle("");
        setSessionDescription("");
        setSelectedDate(null);
        setAvailableSlots([]);
      } else {
        // alert("Failed to book session. Please try again.");
      }
    } catch (error) {
      console.error("Error booking session:", error);
      //   alert("An error occurred while booking the session.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Book a Session</h1>
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={today}
          placeholderText="Click to select date"
          className="w-full p-2 border rounded-md mb-4"
        />
        <button
          onClick={() => fetchAvailableSlots()}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-6"
        >
          Get Slots
        </button>

        {/* Updated slots display section */}
        {availableSlots.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Available Slots</h2>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot: any) => (
                <div
                  key={slot.volunteer_slot_id}
                  className={`px-4 py-2 ${
                    selectedSlot?.volunteer_slot_id === slot.volunteer_slot_id
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-800"
                  } rounded-full cursor-pointer hover:bg-blue-200 transition-colors`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {`${moment(slot.start_time, "HH:mm").format(
                    "hh:mm A"
                  )} - ${moment(slot.end_time, "HH:mm").format("hh:mm A")}`}
                </div>
              ))}
            </div>

            {/* Session details inputs */}
            {selectedSlot && (
              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="sessionTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Session Title
                  </label>
                  <input
                    id="sessionTitle"
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter session title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sessionDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Session Description
                  </label>
                  <textarea
                    id="sessionDescription"
                    value={sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
                    placeholder="Enter session description"
                  />
                </div>

                <button
                  onClick={handleBookSession}
                  className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                  Book Session
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSession;
