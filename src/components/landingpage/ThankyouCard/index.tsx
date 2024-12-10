import React from "react";
import ThankyouIcon from "@/assets/icons/ThankyouIcon";

const ThankyouCard = () => {
    return (
        <div className="bg-white max-w-[1040px] w-full mx-auto flex flex-col items-center justify-center gap-8 p-10 rounded-3xl">
            <ThankyouIcon />
            <p className="text-[2.5rem] font-medium">Thank You for Applying!</p>
            <p className="text-center text-xl font-normal mt-4">
                We appreciate you considering this rewarding opportunity to change lives.
                MelodyWings team will verify the information provided in your application and thank
                you for your enthusiasm and willingness to make a difference in the lives of others.
            </p>
        </div>
    );
};

export default ThankyouCard;
