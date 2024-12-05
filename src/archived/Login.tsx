// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { GetAPI, PostAPI } from "@/api/request";
// import { endpoints } from "@/api/constants";
// import { getLocalStorage, setLocalStorage } from "@/utils/localStorage";

// export type UserRole = "volunteer" | "learner";

// interface AuthResponse {
//     data: string;
// }

// const LoginPage = () => {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const [role, setRole] = useState<UserRole>(
//         (getLocalStorage("role") as UserRole) || "volunteer"
//     );

//     useEffect(() => {
//         const savedRole = getLocalStorage("role") as UserRole;
//         if (savedRole) {
//             setRole(savedRole);
//         }
//     }, []);

//     const handleSignup = useCallback(() => {
//         const code = searchParams.get("code");
//         let isApiSubscribed = true;
//         if (isApiSubscribed) {
//             if (code) {
//                 let payload = {
//                     code,
//                     signup_type: role,
//                 };
//                 PostAPI(endpoints.user.signIn, payload)
//                     .then((response: any) => {
//                         console.log("Signup response:", response.data);
//                         if (typeof window !== "undefined") {
//                             setLocalStorage("token", response.data.auth_token);
//                             if (role === "volunteer") {
//                                 setLocalStorage("volunteer_id", response.data.volunteer_id);
//                             } else {
//                                 setLocalStorage("learner_id", response.data.learner_id);
//                             }
//                         }
//                         if (
//                             response?.data?.onboarded_status === "pending" &&
//                             role === "volunteer"
//                         ) {
//                             router.push(`/volunteer?id=${response.data.volunteer_id}`);
//                         } else if (
//                             response?.data?.onboarded_status === "pending" &&
//                             role === "learner"
//                         ) {
//                             router.push(`/learner?id=${response.data.learner_id}`);
//                         } else {
//                             router.push("/dashboard");
//                         }
//                     })
//                     .catch((error) => {
//                         console.error("Signup error:", error);
//                     });
//             }
//         }
//         return () => {
//             isApiSubscribed = false;
//         };
//     }, [searchParams, role, router]);

//     useEffect(() => {
//         handleSignup();
//     }, [handleSignup]);

//     const handleLogin = () => {
//         GetAPI(endpoints.auth.oauth2callback).then((res: any) => {
//             if (res?.data) {
//                 if (typeof window !== "undefined") {
//                     window.location.href = res.data;
//                 }
//             }
//         });
//     };

//     const handleSetRole = (newRole: UserRole) => {
//         setRole(newRole);
//         setLocalStorage("role", newRole);
//     };

//     return (
//         <div className="flex flex-col items-center justify-center h-screen gap-4">
//             <h1 className="text-2xl font-bold">Login Page</h1>

//             <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg">
//                 <button
//                     onClick={() => handleSetRole("volunteer")}
//                     className={`px-4 py-2 rounded-md bg-primary  transition-colors duration-300 ${
//                         role === "volunteer"
//                             ? "bg-blue-500 text-white"
//                             : "bg-transparent text-gray-700"
//                     }`}
//                 >
//                     Volunteer
//                 </button>
//                 <button
//                     onClick={() => handleSetRole("learner")}
//                     className={`px-4 py-2 rounded-md  bg-primary transition-colors duration-300 ${
//                         role === "learner"
//                             ? "bg-blue-500 text-white"
//                             : "bg-transparent text-gray-700"
//                     }`}
//                 >
//                     Learner
//                 </button>
//             </div>

//             <button
//                 onClick={handleLogin}
//                 className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 px-7"
//             >
//                 Login as {role}
//             </button>
//         </div>
//     );
// };

// export default LoginPage;
