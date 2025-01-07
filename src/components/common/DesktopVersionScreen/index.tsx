import React from "react";
import Logo from "../Logo";
import Image from "next/image";
import DesktopImage from "@/assets/images/DesktopImg.png";

const DesktopVersionScreen = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-between">
            <span className="mt-10">
                <Logo />
            </span>
            <div className="flex px-2 -mt-20 flex-col items-center justify-center">
                <div className="w-[50%]">
                    <Image src={DesktopImage} alt="Desktop" className="w-full h-full" />
                </div>
                <p className="text-center text-base font-medium">
                    For enhanced functionality and a smoother experience, switch to the desktop
                    version!
                </p>
            </div>
            <div></div>
        </div>
    );
};

export default DesktopVersionScreen;
