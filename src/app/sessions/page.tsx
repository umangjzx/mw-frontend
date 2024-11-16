"use client";
import React, { useState } from "react";
import { endpoints } from "@/api/constants";
import { GetAPI, PutAPI } from "@/api/request";
import { useQuery } from "@tanstack/react-query";
import { getLocalStorage } from "@/utils/localStorage";

interface Session {
  session_id: string;
  volunteer_id: string;
  volunteer_slot_id: string;
  session_date: string;
  session_title: string;
  session_description: string;
  learner_id: string;
  meet_link: string;
}

interface SessionResponse {
  items: Session[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Sessions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const learner_id = getLocalStorage("learner_id") as string;
  const fetchSessions = async () => {
    return await GetAPI(endpoints.session.getLearnerSessions(learner_id)).then(
      (res: any) => {
        return res;
      }
    );
  };

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  const filteredSessions = sessions?.data?.items?.filter(
    (session: Session) =>
      session.session_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.session_description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, "_blank");
  };

  const handleCancelSession = (sessionId: string) => {
    PutAPI(endpoints.session.cancelSession(sessionId), {
      status: "cancelled",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 bg-[#f5f5f5] min-h-screen">
      <h1 className="text-2xl font-bold text-black mb-5 text-center">
        Learning Sessions
      </h1>

      <input
        className="w-full h-10 border border-gray-300 rounded-md px-3 mb-5 bg-white"
        placeholder="Search by title or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSessions?.map((session: Session) => (
          <div
            key={session.session_id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-bold mb-2">{session.session_title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              Description: {session.session_description}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Date: {new Date(session.session_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Session ID: {session.session_id}
            </p>
            <button
              onClick={() => handleJoinMeeting(session.meet_link)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Join Meeting
            </button>
            <button
              onClick={() => handleCancelSession(session.session_id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Cancel Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
