import React, { useEffect } from "react";
import Lottie from "react-lottie-player";
import LearnerLoadingAnimation from "@/assets/json/animations/Learner.json";
import VolunteerLoadingAnimation from "@/assets/json/animations/Volunteer.json";
import Cookies from "js-cookie";

type Props = {
    isLoading: boolean;
    children?: React.ReactNode;
};

const LottieLoader: React.FC<Props> = ({ isLoading }) => {
    const role = Cookies.get("role");

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoading]);
    return (
        <>
            {isLoading && (
                <div
                    style={{ zIndex: "9999999" }}
                    className="w-full h-full flex-center">
                    <div className="w-[9rem] h-[9rem] ">
                        <Lottie
                            loop
                            play
                            animationData={role === "learner" ? LearnerLoadingAnimation : VolunteerLoadingAnimation}
                            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                            style={{ width: "100%", borderRadius: "10px" }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default LottieLoader;