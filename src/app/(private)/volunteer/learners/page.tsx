"use client";

import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import { MessageModal, TestmonialModal } from "@/components/learners/Modals";
import LearnersTable from "@/components/learners/Table";
import { getHeaderIcon } from "@/layouts/helper";
import { useComponentStore } from "@/store/useComponenetStore";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import InnerWidth from "@/utils/innerWidth";
import CardChips from "@/components/leaner/VolunteerCard/CardChips";
import Image from "next/image";
import DummyProfile from "@/assets/images/DummyProfile.png";
import { Divider } from "antd";
import { SeeMoreIcon } from "@/assets/icons";
import Button from "@/components/common/Button";
import MobileMessageModal from "@/components/learners/Modals/MobileMessageModal";

interface PaginationParams {
    page: number;
    size: number;
}

interface TableLearner {
    id: string;
    name: string;
    classesTaken: number;
    subject: string;
}

const LearnerCard = ({ learner, handleTestimonial, handleMessage }: { learner: any, handleTestimonial: () => void, handleMessage: () => void }) => {
    const { profileImage = "image_url", name = "", classesTaken = "", location = "" } = learner;
    return (
        <div className="bg-white rounded-xl w-full p-4 space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-[40px] h-[40px] rounded-full relative">
                    <Image
                        src={profileImage !== "image_url" ? profileImage : DummyProfile}
                        alt="avatar"
                        fill
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-base font-semibold">{name}</p>
                    <p className="text-sm font-medium">{location && `From ${location}`}</p>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-1">
                    <CardChips label="Classes Taken" value={classesTaken || "0"} />
                </div>
                <div className="w-full border-t pt-3 mt-3 flex justify-between gap-2">
                    <Button
                        title="Upload Testimonial"
                        customClassName="!px-2 !py-1 !h-auto !rounded-2xl !text-sm"
                        btnVariant="tertiary"
                        onClick={handleTestimonial}
                    />
                    <Button
                        title="Message Learner"
                        customClassName="!px-2 !py-1 !h-auto !rounded-2xl !text-sm"
                        btnVariant="tertiary"
                        onClick={handleMessage}
                    />
                </div>
            </div>
        </div>
    );
}

export default function LearnersPage() {
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();
    const isMobileScreen = InnerWidth() < 768;

    const [learnerData, setLearnerData] = useState<TableLearner[]>([]);
    const [pagination, setPagination] = useState<PaginationParams>({
        page: 1,
        size: 10,
    });
    const [total, setTotal] = useState<number>(0);
    const volunteerId = Cookies.get("volunteer_id");
    const [size] = useQueryState("size", { defaultValue: "10" });
    const [page] = useQueryState("page", { defaultValue: "1" });
    const [query] = useQueryState("query");

    const getAllLearners = async ({ page, size }: PaginationParams) => {
        const endpoint = `${endpoints.volunteer.getConnectedLearners(
            volunteerId as string
        )}?query=${query || ""}&page=${page}&size=${size}`;
        const response: any = await GET_API(endpoint);
        return response.data;
    };

    const { data: learners, isLoading } = useQuery({
        queryKey: ["learners", pagination.page, pagination.size, query],
        queryFn: () => getAllLearners(pagination),
    });

    useEffect(() => {
        if (learners?.items) {
            const transformedData = learners.items.map((learner: any) => ({
                id: learner.learner_id,
                name: `${learner.learner_name}`,
                classesTaken: learner.total_sessions
            }));
            setLearnerData(transformedData);
            setTotal(learners.total);
        }
    }, [learners]);

    const handleTableChange = (pagination: any) => {
        setPagination({
            page: pagination.current,
            size: pagination.pageSize,
        });
    };

    const [learnerId, setLearnerId] = useQueryState("id", {
        shallow: true,
    });
    const [mode, setMode] = useQueryState("mode", {
        shallow: true,
    });

    const handleMessageLearner = (learnerId: string) => {
        console.log("Message learner:", learnerId);
        setLearnerId(learnerId);
        setMode("message");
    };

    const handleUploadTestimonial = (learnerId: string) => {
        console.log("Upload testimonial:", learnerId);
        setLearnerId(learnerId);
        setMode("testimonial");
    };

    const handleClose = () => {
        setLearnerId(null);
        setMode(null);
    };

    useEffect(() => {
        setHeaderOptions({
            title: "Learners",
            titleIcon: getHeaderIcon(pathname),
        });
    }, [setHeaderOptions]);
    
    const LearnerMessageModal = isMobileScreen ? MobileMessageModal : MessageModal;

    return (
        <div className="w-full h-full py-6 px-4 md:p-6 animate-fadeIn">
            <LearnerMessageModal key={learnerId} receiverId={learnerId} isOpen={mode === "message"} onClose={handleClose} />
            <TestmonialModal
                isOpen={mode === "testimonial"}
                mode={"create"}
                onClose={handleClose}
            />
            {
                isMobileScreen ?
                    <div className="grid grid-cols-1">
                        {
                            learnerData.map((learner, index) => (
                                <LearnerCard
                                    key={index}
                                    learner={learner}
                                    handleMessage={() => handleMessageLearner(learner?.id)}
                                    handleTestimonial={() => handleUploadTestimonial(learner?.id)}
                                />
                            ))
                        }
                    </div> :
                    <LearnersTable
                        data={learnerData}
                        handleMessageLearner={handleMessageLearner}
                        handleUploadTestimonial={handleUploadTestimonial}
                        loading={isLoading}
                        pagination={{
                            current: pagination.page,
                            pageSize: pagination.size,
                            total: total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                        onChange={handleTableChange}
                    />
            }
        </div>
    );
}
