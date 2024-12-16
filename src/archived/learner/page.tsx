"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { endpoints } from "@/api/constants";
import { PUT_API } from "@/api/request";

const Learner = () => {
    const [name, setName] = useState("");
    const [parentName, setParentName] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const [gender, setGender] = useState("");
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const handleFill = () => {
        const firstNames = [
            "Emma",
            "Liam",
            "Olivia",
            "Noah",
            "Ava",
            "William",
            "Sophia",
            "James",
            "Isabella",
            "Oliver",
        ];
        const lastNames = [
            "Smith",
            "Johnson",
            "Williams",
            "Brown",
            "Jones",
            "Garcia",
            "Miller",
            "Davis",
            "Rodriguez",
            "Martinez",
        ];
        const genders = ["Male", "Female"];
        const languages = ["English", "Spanish", "French", "German", "Italian"];
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomParentFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomGender = genders[Math.floor(Math.random() * genders.length)];
        const randomLanguage = languages[Math.floor(Math.random() * languages.length)];

        const studentName = `${randomFirstName} ${randomLastName}`;
        const parent = `${randomParentFirstName} ${randomLastName}`;

        setName(studentName);
        setParentName(parent);
        setGender(randomGender);
        setPreferredLanguage(randomLanguage);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let payload = {
            learner_name: name,
            learner_parent_name: parentName,
            learner_gender: gender,
            learner_preferred_language: preferredLanguage,
        };
        PUT_API(endpoints.learner.update(id as string), payload).then((res: any) => {
            console.log(res, "res");
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Learner Registration</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Student Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="parentName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Parent Name
                        </label>
                        <input
                            type="text"
                            id="parentName"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="language"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Preferred Language
                        </label>
                        <select
                            id="language"
                            value={preferredLanguage}
                            onChange={(e) => setPreferredLanguage(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="">Select Language</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Italian">Italian</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleFill}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Fill with Demo Data
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Learner;
