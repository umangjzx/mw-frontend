"use client";
import { endpoints } from "@/api/constants";
import LottieLoader from "@/components/common/Loader/Lottie";
import Celebrate from "@/components/landingpage/Celebrate";
import Community from "@/components/landingpage/Community";
import Testimonials from "@/components/landingpage/testimonials";
import ForLearner from "@/components/landingpage/ForLearner";
import ForVolunteer from "@/components/landingpage/ForVolunteer";
import Hero from "@/components/landingpage/Hero";
import Impact from "@/components/landingpage/Impact";
import WhyWeBuild from "@/components/landingpage/WhyWeBuild";
import Footer from "@/components/onboarding/Footer";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { API_URL } from "@/definitions";
import CookieConsent from "@/components/landingpage/Cookie";

export default function Page() {
    const router = useRouter();
    const [role, setRole] = useState<UserType>((Cookies.get("role") as UserType) || "volunteer");
    const [loginAs, setLoginAs] = useQueryState("loginAs");
    const [buttonLoading, setButtonLoading] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(false);
    const handleLogin = useGoogleLogin({
        onSuccess: async (response) => SIGN_IN(response),
    });

    const SIGN_IN = async (response: any) => {
        let payload = {
            signup_type: role,
        };
        await fetch(`${API_URL}/${endpoints.user.signIn}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${response.access_token}`,
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                const response = await res.json();
                if (response) {
                    console.log(response, "LOGIN RESPONSE");
                    handleSignUpSuccess(response);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSignUpSuccess = (data: any) => {
        const idKey = role === "volunteer" ? "volunteer_id" : "learner_id";

        const decodedToken: any = jwtDecode(data?.access_token);
        const currentTime = Math.floor(Date.now() / 1000);
        const expireSeconds = decodedToken?.exp - currentTime;
        const expireDays = Math.ceil(expireSeconds / (60 * 60 * 24)) || 1;

        Cookies.set(idKey, data[idKey], { expires: expireDays });
        Cookies.set("token", data?.access_token, { expires: expireDays });
        Cookies.set("role", role, { expires: expireDays });
        Cookies.set("onboarded_status", data?.onboarded_status, { expires: expireDays });

        handleNavigation(data);
    };

    const handleNavigation = (data: any) => {
        if (data.onboarded_status === "verification_pending") {
            router.replace("/onboarding/verification");
        } else if (data.onboarded_status === "details_pending") {
            router.replace("/onboarding");
        } else if (data.onboarded_status === "verification_completed") {
            router.replace(`/${role}/schedule`);
        }
    };

    useEffect(() => {
        const savedRole = Cookies.get("role") as UserType;
        if (savedRole) {
            setRole(savedRole);
        }
    }, []);

    const handleSetRole = (newRole: UserType) => {
        setRole(newRole);
        Cookies.set("role", newRole, { expires: 30 });
        handleLogin();
    };

    useEffect(() => {
        if (loginAs === "volunteer" || loginAs === "learner") {
            handleSetRole(loginAs);
            setLoginAs(null);
        }
    }, [loginAs]);

    useEffect(() => {
        let sr: any;

        const setupScrollReveal = async () => {
            if (typeof window !== "undefined") {
                const ScrollReveal = (await import("scrollreveal")).default;
                sr = ScrollReveal({
                    origin: "bottom",
                    distance: "3px",
                    duration: 800,
                    delay: 100,
                    easing: "ease-out",
                    reset: true,
                    viewFactor: 0.1,
                    viewOffset: { top: 0, right: 0, bottom: -100, left: 0 },
                });

                sr.reveal(".reveal", {
                    interval: 100,
                });
            }
        };

        setupScrollReveal();

        return () => {
            if (sr) {
                sr.destroy();
            }
        };
    }, []);

    if (isPageLoading)
        return (
            <div className="h-[100vh] w-full flex-center">
                <LottieLoader isLoading={isPageLoading} />
            </div>
        );

    return (
        <div className="w-full overflow-x-hidden bg-background-input relative">
            <Hero handleSetRole={handleSetRole} buttonLoading={buttonLoading} />
            <div className="flex flex-col gap-20 lg:gap-[7rem] py-[7rem]">
                <div className="reveal px-[9%]" id="about-us">
                    <WhyWeBuild />
                </div>
                <div className="reveal px-[9%]" id="our-impact">
                    <Impact />
                </div>
                <div className="flex flex-col lg:gap-20">
                    <div className="reveal lg:px-[9%]">
                        <ForLearner onLearnerLogin={handleSetRole} />
                    </div>
                    <div className="reveal lg:px-[9%]">
                        <ForVolunteer onVolunteerLogin={handleSetRole} />
                    </div>
                </div>
                <div className="reveal px-[7%]">
                    <Community />
                </div>
                <div className="reveal">
                    <Testimonials />
                </div>
                <div className="reveal px-[4%] lg:px-[9%]">
                    <Celebrate />
                </div>
            </div>
            <Footer />
            <CookieConsent />
        </div>
    );
}
