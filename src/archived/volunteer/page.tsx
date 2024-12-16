// "use client";

// import React, { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { PutAPI } from "@/api/request";
// import { endpoints } from "@/api/constants";

// export default function Volunteer() {
//     const router = useRouter();
//     const [name, setName] = useState("");
//     const [gender, setGender] = useState("");
//     const [service, setService] = useState("");
//     const searchParams = useSearchParams();
//     const id = searchParams.get("id");

//     const handleFill = () => {
//         const firstNames = [
//             "James",
//             "Emma",
//             "Liam",
//             "Olivia",
//             "Noah",
//             "Ava",
//             "William",
//             "Sophia",
//             "Michael",
//             "Isabella",
//         ];
//         const lastNames = [
//             "Smith",
//             "Johnson",
//             "Williams",
//             "Brown",
//             "Jones",
//             "Garcia",
//             "Miller",
//             "Davis",
//             "Rodriguez",
//             "Martinez",
//         ];

//         const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//         const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//         const randomName = `${randomFirstName} ${randomLastName}`;

//         const services = ["Art", "Academic", "Music", "Drawing", "Singing"];
//         const randomService = services[Math.floor(Math.random() * services.length)];

//         setName(randomName);
//         setGender("male");
//         setService(randomService);
//     };

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         console.log("Name:", name);
//         console.log("Gender:", gender);
//         console.log("Service:", service);
//         let payload = {
//             volunteer_name: name,
//             volunteer_gender: gender,
//             volunteer_service_type: service,
//         };
//         PutAPI(endpoints.volunteer.update(id), payload).then((res) => {
//             // router.push("/dashboard");
//         });
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-black">
//             <h1 className="text-2xl font-bold text-white mb-8">Volunteer</h1>

//             <button
//                 type="button"
//                 onClick={handleFill}
//                 className="w-full max-w-md bg-blue-600 text-white font-bold py-3 px-4 rounded mb-4 hover:bg-blue-700 transition-colors"
//             >
//                 Fill with Demo Data
//             </button>

//             <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
//                 <div>
//                     <label htmlFor="name" className="sr-only">
//                         Name
//                     </label>
//                     <input
//                         id="name"
//                         type="text"
//                         placeholder="Enter your name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                         className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="email" className="sr-only">
//                         Email
//                     </label>
//                     <input
//                         id="gender"
//                         type="text  "
//                         placeholder="Enter your gender"
//                         value={gender}
//                         onChange={(e) => setGender(e.target.value)}
//                         required
//                         className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="service" className="sr-only">
//                         Service Type
//                     </label>
//                     <input
//                         id="service"
//                         type="text"
//                         placeholder="Enter service type"
//                         value={service}
//                         onChange={(e) => setService(e.target.value)}
//                         required
//                         className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition-colors"
//                 >
//                     SUBMIT
//                 </button>
//             </form>
//         </div>
//     );
// }
