"use client";
import Image from "next/image";
import React from "react";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Button from "@/components/common/Button";
import { IoMdCheckmark } from "react-icons/io";
import { MdClose } from "react-icons/md";
const NotificationCard = () => {
    return (
        <div className="flex flex-col gap-4 border rounded-xl p-4 border-[#E0E0E0] h-fit w-[360px]">
            <div className="flex items-center gap-2">
                <div>
                    <Image src={DummyProfileImg} alt="notification" width={40} height={40} />
                </div>
                <p className="font-normal">
                    <span className="font-semibold">John Doe</span> requested for a meeting
                </p>
            </div>
            <div className="flex gap-2 items-center justify-between">
                <div className="flex flex-col gap-1 ">
                    <p className="text-[0.75rem] font-medium text-gray-light">Subject</p>
                    <p className="text-sm font-medium">Music</p>
                </div>
                <div className="flex flex-col gap-1 ">
                    <p className="text-[0.75rem] font-medium text-gray-light">Date</p>
                    <p className="text-sm font-medium">23 Nov 2024</p>
                </div>
                <div className="flex flex-col gap-1 ">
                    <p className="text-[0.75rem] font-medium text-gray-light">Time</p>
                    <p className="text-sm font-medium">9:30 - 10:30 AM</p>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full">
                <Button
                    btnVariant="error"
                    icon={<MdClose className="text-[1.1rem]" />}
                    className="w-full text-sm h-9 border-error-light rounded-xl py-2"
                >
                    Decline
                </Button>
                <Button
                    btnVariant="success"
                    icon={<IoMdCheckmark className="text-[1.1rem]" />}
                    className="w-full text-sm h-9 border-success-light rounded-xl py-2"
                >
                    Accept
                </Button>
            </div>
        </div>
    );
};

export default NotificationCard;
