import React, { useEffect } from "react";
import Lottie from "react-lottie-player";
import LearnerLoadingAnimation from "@/assets/json/animations/Learner.json";
import VolunteerLoadingAnimation from "@/assets/json/animations/Volunteer.json";
import Cookies from "js-cookie";
import { createPortal } from "react-dom";

type Props = {
    isLoading: boolean;
    customClassName?: string;
    children?: React.ReactNode;
    zIndex?: string | number;
    fullscreen?: boolean;
};

const LottieLoader: React.FC<Props> = ({
    isLoading,
    customClassName,
    zIndex,
    fullscreen = true,
}) => {
    const role = Cookies.get("role");

    useEffect(() => {
        if (typeof window === "undefined") return; // SSR safety check

        if (fullscreen && isLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoading, fullscreen]);
    if (!isLoading || typeof window === "undefined") return null;

    const loaderContent = (
        <div className={`w-[6rem] md:w-[8rem] lg:w-[9rem] h-[6rem] md:h-[8rem] lg:h-[9rem] flex-center ${customClassName}`}>
            <Lottie
                loop
                play
                animationData={role === "learner" ? LearnerLoadingAnimation : VolunteerLoadingAnimation}
                rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                style={{ width: "100%", borderRadius: "10px" }}
            />
        </div>
    );

    if (!fullscreen) {
        return <div className="w-full h-full min-h-[70vh] flex items-center justify-center">{loaderContent}</div>;
    }

    return createPortal(
        <div
            style={{ zIndex: zIndex || 2000 }}
            className="fixed inset-0 w-screen h-screen flex-center"
        >
            {loaderContent}
        </div>,
        document.body
    );
};

export default LottieLoader;