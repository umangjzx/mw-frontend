"use client";
import { endpoints } from "@/api/constants";
import { GET_API, POST_API } from "@/api/request";
import Celebrate from "@/components/landingpage/Celebrate";
import Community from "@/components/landingpage/Community";
import ForLearner from "@/components/landingpage/ForLearner";
import ForVolunteer from "@/components/landingpage/ForVolunteer";
import Hero from "@/components/landingpage/Hero";
import Impact from "@/components/landingpage/Impact";
import WhyWeBuild from "@/components/landingpage/WhyWeBuild";
import Footer from "@/components/onboarding/Footer";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";

export default function Page() {
    const router = useRouter();
    const [role, setRole] = useState<UserType>((Cookies.get("role") as UserType) || "volunteer");
    const [code] = useQueryState("code");
    const [buttonLoading, setButtonLoading] = useState("");

    const handleSignUp = async () => {
        try {
            const payload = {
                code,
                signup_type: role,
            };
            const response = await POST_API(endpoints.user.signIn, payload);

            if (response.status === 200 || response.status === 201) {
                handleSignUpSuccess(response?.data);
            }

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
        Cookies.set("onboarded_status", data.onboarded_status);
        handleNavigation(data);
    };

    const handleNavigation = (data: any) => {
        if (data.onboarded_status === "verification_pending") {
            router.push("/onboarding/verification");
        } else if (data.onboarded_status === "details_pending") {
            router.push("/onboarding");
        } else if (data.onboarded_status === "verification_completed") {
            router.push(`/${role}/schedule`);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["onboarded_status"],
        queryFn: handleSignUp,
        enabled: !!code,
    });

    useEffect(() => {
        const savedRole = Cookies.get("role") as UserType;
        if (savedRole) {
            setRole(savedRole);
        }
    }, []);

    const handleLogin = (newRole: UserType) => {
        setButtonLoading(newRole);
        GET_API(endpoints.auth.oauth2callback)
            .then((res: any) => {
                setButtonLoading("");
                if (res?.data) {
                    if (typeof window !== "undefined") {
                        window.location.href = res.data;
                    }
                }
            })
            .catch((err) => {
                console.log("err ", err);
                setButtonLoading("");
            });
    };

    const handleSetRole = (newRole: UserType) => {
        setRole(newRole);
        Cookies.set("role", newRole);
        handleLogin(newRole);
    };

    useEffect(() => {
        let sr: any;

        const setupScrollReveal = async () => {
            if (typeof window !== "undefined") {
                const ScrollReveal = (await import("scrollreveal")).default;
                sr = ScrollReveal({
                    origin: "bottom",
                    distance: "30px",
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

    return (
        <div className="w-full overflow-x-hidden bg-background-input">
            <Hero handleSetRole={handleSetRole} buttonLoading={buttonLoading} />
            <div className="flex flex-col gap-[7rem] py-[7rem] px-[9%]">
                <div className="reveal" id="our-mission">
                    <WhyWeBuild />
                </div>
                <div className="reveal" id="our-impact">
                    <Impact />
                </div>
                <div className="reveal">
                    <ForLearner />
                </div>
                <div className="reveal">
                    <ForVolunteer />
                </div>
                <div className="reveal">
                    <Community />
                </div>
                <div className="reveal">
                    <Celebrate />
                </div>
            </div>
            <Footer />
        </div>
    );
}
