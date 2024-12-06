"use client";
import React from "react";
import ViewModal from "@/components/common/Modals/ViewModal";
import FeedModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";
import Divider from "@/components/common/Divider";
import Button from "@/components/common/Button";

const MeetingPreviewModal = () => {
    return (
        <ViewModal modalOpen={true} onClose={() => {}}>
            <div className="flex flex-col gap-6 p-5">
                <div className="flex justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-xl text-black">Guitar class with Sam</p>
                        <p className="text-gray-light font-medium text-sm">
                            Saturday, November 23, 9:30 - 10:00am
                        </p>
                    </div>
                    <FeedModalCloseIcon />
                </div>
                <Divider />
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-2">
                        <Button
                            title="Join with Google Meet"
                            customClassName="w-fit !bg-background-secondary rounded-xl !outline-none !border-none !text-black"
                        />
                        <a
                            href="https://meet.google.com/tes-qwe-tyu"
                            className="font-medium text-[12px] ml-1"
                        >
                            meet.google.com/tes-qwe-tyu
                        </a>
                    </div>
                    <Button
                        title="Copy Link"
                        customClassName="w-fit bg-white !text-black text-sm rounded-full !py-0 !px-5"
                    />
                </div>
                <Divider />
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-sm text-gray-light">Guest</p>
                    <p className="text-black font-medium">
                        sam@gmail.com (Host), johndoe12@gmail.com
                    </p>
                </div>
                <Divider />
                <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-sm text-[#16A34A]">Feedback Completed</p>
                    <p className="text-primary text-sm underline font-medium">See Feedback</p>
                </div>
                <Divider />
                <div className="flex items-center justify-between gap-3">
                    <p className="text-gray-light font-medium text-sm">Availability Status</p>
                    {/* <p className="text-[#DC2626] font-medium text-sm">Availability Status</p> */}
                    <Button
                        title="Mark as Available"
                        customClassName="w-fit bg-white !text-[#DC2626] border border-[#DC2626] text-sm rounded-full !py-0 !px-5"
                    />
                </div>
            </div>
        </ViewModal>
    );
};

export default MeetingPreviewModal;
