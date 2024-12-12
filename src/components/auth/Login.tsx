"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { endpoints } from "@/api/constants";
import { GET_API, POST_API } from "@/api/request";
import Cookies from "js-cookie";


interface AuthResponse {
    data: string;
}

const LoginPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [role, setRole] = useState<UserType>(
        (Cookies.get("role") as UserType) || "volunteer"
    );

    useEffect(() => {
        const savedRole = Cookies.get("role") as UserType;
        if (savedRole) {
            setRole(savedRole);
            // router.replace(`/onboarding`);
        }
    }, []);

    const handleSignup = useCallback(() => {
        const code = searchParams.get("code");
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            if (code) {
                let payload = {
                    code,
                    signup_type: role,
                };
                POST_API(endpoints.user.signIn, payload)
                    .then((response: any) => {
                        console.log("Signup response:", response.data);
                        if (typeof window !== "undefined") {
                            Cookies.set("token", response.data.access_token);
                            if (role === "volunteer") {
                                Cookies.set("volunteer_id", response.data.volunteer_id);
                            } else {
                                Cookies.set("learner_id", response.data.learner_id);
                            }
                        }
                        if (
                            response?.data?.onboarded_status === "pending" &&
                            role === "volunteer"
                        ) {
                            // router.push(`/volunteer?id=${response.data.volunteer_id}`);
                        } else if (
                            response?.data?.onboarded_status === "pending" &&
                            role === "learner"
                        ) {
                            // router.push(`/learner?id=${response.data.learner_id}`);
                        } else {
                            Cookies.set("refresh_token", response.data.refresh_token);
                            Cookies.set("token", response.data.access_token);
                            Cookies.set("role", role);
                            Cookies.set("volunteer_id", response.data.volunteer_id);
                            // router.push("/onboarding");
                        }
                    })
                    .catch(error => {
                        console.error("Signup error:", error);
                    });
            }
        }
        return () => {
            isApiSubscribed = false;
        };
    }, [searchParams, role, router]);

    useEffect(() => {
        handleSignup();
    }, [handleSignup]);

    const handleLogin = () => {
        GET_API(endpoints.auth.oauth2callback).then((res: any) => {
            console.log("res", res);
            if (res?.data) {
                if (typeof window !== "undefined") {
                    window.location.href = res.data;
                }
            }
        });
    };

    const handleSetRole = (newRole: UserType) => {
        console.log("newRole", newRole);
        setRole(newRole);
        Cookies.set("role", newRole);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <h1 className='text-2xl font-bold'>Login Page</h1>

            <div className='flex items-center gap-4 bg-gray-100 p-2 rounded-lg'>
                <button
                    onClick={() => handleSetRole("volunteer")}
                    className={`px-4 py-2 rounded-md bg-primary  transition-colors duration-300 ${
                        role === "volunteer"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-700"
                    }`}
                >
                    Volunteer
                </button>
                <button
                    onClick={() => handleSetRole("learner")}
                    className={`px-4 py-2 rounded-md  bg-primary transition-colors duration-300 ${
                        role === "learner"
                            ? "bg-blue-500 text-white"
                            : "bg-transparent text-gray-700"
                    }`}
                >
                    Learner
                </button>
            </div>

            <button
                onClick={handleLogin}
                className='bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 px-7'
            >
                Login as {role}
            </button>
        </div>
    );
};

export default LoginPage;
