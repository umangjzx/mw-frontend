"use client";
import React, { useState } from "react";
import { endpoints } from "@/api/constants";
import { GetAPI } from "@/api/request";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
interface Volunteer {
  volunteer_id: string;
  volunteer_name: string;
  volunteer_service_type: string;
  volunteer_gender: string;
}

interface VolunteerResponse {
  items: Volunteer[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export default function SearchVolunteer() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const fetchVolunteers = async () => {
    return await GetAPI(endpoints.volunteer.getAllVolunteers).then(
      (res: any) => {
        return res;
      }
    );
  };

  const { data: volunteers, isLoading } = useQuery({
    queryKey: ["volunteers"],
    queryFn: fetchVolunteers,
  });

  const filteredVolunteers = volunteers?.data?.items?.filter(
    (volunteer: Volunteer) =>
      volunteer.volunteer_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      volunteer.volunteer_service_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleBookSession = (volunteerId: string) => {
    router.push(`/volunteer/${volunteerId}/booksession`);
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
        Find a Volunteer
      </h1>

      <input
        className="w-full h-10 border border-gray-300 rounded-md px-3 mb-5 bg-white"
        placeholder="Search by name or service..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVolunteers?.map((volunteer: Volunteer) => (
          <div
            key={volunteer.volunteer_id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-bold mb-2">
              {volunteer.volunteer_name}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              Service: {volunteer.volunteer_service_type}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Gender: {volunteer.volunteer_gender}
            </p>
            <button
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              onClick={() => handleBookSession(volunteer.volunteer_id)}
            >
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
