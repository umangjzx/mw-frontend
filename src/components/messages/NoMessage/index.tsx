import React from "react";
import Image from "next/image";
import Nomessage from "@/assets/images/Nomessage.png";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const NoMessage = () => {
    const router = useRouter();
    const role = Cookies.get("role");

    const handleGoToSettings = () => {
        if (role === "volunteer") {
            router.push("/volunteer/settings");
        } else {
            router.push("/learner/settings");
        }
    };

    const handleStartConversation = () => {
        if (role === "volunteer") {
            router.push("/volunteer/learners");
        } else {
            router.push("/learner/volunteer");
        }
    };
    return (
        <div className="w-full h-full mt-[-5rem] flex flex-col gap-4 bg-white items-center justify-center animate-fadeIn">
            <div className="w-[319px] h-[259px] relative flex items-center justify-center">
                <Image src={Nomessage} alt="No Message" fill />
            </div>
            <p className="text-2xl font-medium">No Messages Yet</p>
            <p className="text-base text-center">
                Looks like you haven't initiated a conversation with <br /> any of our volunteers.
            </p>
            <Button
                onClick={handleStartConversation}
                className="!bg-black !text-white hover:!bg-black/80 hover:!text-white !rounded-full"
            >
                Start Conversation
            </Button>
            <p className="text-base text-center">
                Let volunteers reach out and help - turn on messages.{"  "}
                <span
                    className="font-medium hover:underline cursor-pointer"
                    onClick={handleGoToSettings}
                >
                    Go to settings
                </span>
            </p>
        </div>
    );
};

export default NoMessage;
