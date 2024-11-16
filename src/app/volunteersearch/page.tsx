"use client";
import React, { useState } from "react";

const mockVolunteers = [
  { id: "1", name: "John Doe", service: "Art", email: "john@example.com" },
  { id: "2", name: "Jane Smith", service: "Music", email: "jane@example.com" },
  { id: "3", name: "Bob Wilson", service: "Drawing", email: "bob@example.com" },
  {
    id: "4",
    name: "Alice Brown",
    service: "Academic",
    email: "alice@example.com",
  },
  { id: "5", name: "Tom Davis", service: "Singing", email: "tom@example.com" },
];

export default function SearchVolunteer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVolunteers, setFilteredVolunteers] = useState(mockVolunteers);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = mockVolunteers.filter(
      (volunteer) =>
        volunteer.name.toLowerCase().includes(text.toLowerCase()) ||
        volunteer.service.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVolunteers(filtered);
  };

  return (
    <div className="flex flex-col p-5 bg-[#f5f5f5] min-h-screen">
      <h1 className="text-2xl font-bold text-black mb-5 text-center">
        Find a Volunteer
      </h1>

      <input
        className="w-full h-10 border border-gray-300 rounded-md px-3 mb-5 bg-white"
        placeholder="Search by name or service..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVolunteers.map((volunteer) => (
          <div key={volunteer.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">{volunteer.name}</h2>
            <p className="text-sm text-gray-600 mb-1">
              Service: {volunteer.service}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Email: {volunteer.email}
            </p>
            <button className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              Contact
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
