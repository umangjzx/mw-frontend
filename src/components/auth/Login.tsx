"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { endpoints } from "@/api/constants";
import { GET_API, POST_API } from "@/api/request";
import Cookies from "js-cookie";
import { useQueryState } from "nuqs";
import { useSendData } from "@/hooks/useReactQuery";
import Button from "../common/Button";

const LoginPage = () => {
    const router = useRouter();
    const [role, setRole] = useState<UserType>((Cookies.get("role") as UserType) || "volunteer");
    const [code] = useQueryState("code");

    const handleSignUp = async () => {
        try {
            const payload = {
                code,
                signup_type: role,
            };
            const response = await POST_API(endpoints.user.signIn, payload);
            return response?.data;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    const handleSignUpSuccess = (data: any) => {
        const idKey = role === "volunteer" ? "volunteer_id" : "learner_id";
        Cookies.set(idKey, data[idKey]);
        Cookies.set("token", data.access_token);
        Cookies.set("refresh_token", data.refresh_token);
        Cookies.set("role", role);
        router.push("/onboarding");
    };

    const { mutate: signUp, isPending } = useSendData({
        fn: handleSignUp,
        success: handleSignUpSuccess,
        error: (error: any) => {
            console.error("Error signing up:", error);
        },
    });

    useEffect(() => {
        const savedRole = Cookies.get("role") as UserType;
        if (savedRole) {
            setRole(savedRole);
        }
    }, []);

    useEffect(() => {
        if (!code) return;
        signUp(code);
    }, [signUp, code]);

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

            <Button
                onClick={handleLogin}
                title={`Login as ${role}`}
                loading={isPending}
                rootClassName='bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 px-7'
            />
        </div>
    );
};

export default LoginPage;
