"use client";
import LoginPage from "@/components/auth/Login";
import WhyWeBuild from "@/components/landingpage/WhyWeBuild";
import Impact from "@/components/landingpage/Impact";
import ForVolunteer from "@/components/landingpage/ForVolunteer";
import ForLearner from "@/components/landingpage/ForLearner";
import Celebrate from "@/components/landingpage/Celebrate";
import Community from "@/components/landingpage/Community";
import Hero from "@/components/landingpage/Hero";
import Footer from "@/components/onboarding/Footer";
import ScrollReveal from "scrollreveal";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        // Initialize ScrollReveal with updated configuration
        const sr = ScrollReveal({
            origin: "bottom",
            distance: "30px",
            duration: 800,
            delay: 100,
            easing: "ease-out",
            reset: true,
            viewFactor: 0.1,
            viewOffset: { top: 0, right: 0, bottom: -100, left: 0 },
        });

        // Apply ScrollReveal to elements
        sr.reveal(".reveal", {
            interval: 100,
        });

        // Clean up
        return () => sr.destroy();
    }, []);

    return (
        <div className="w-screen bg-background-input">
            <Hero />
            <div className="flex flex-col gap-[7rem] py-[7rem] px-[9%]">
                <div className="reveal">
                    <WhyWeBuild />
                </div>
                <div className="reveal">
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
