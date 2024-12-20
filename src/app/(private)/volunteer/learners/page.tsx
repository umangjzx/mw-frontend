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

export default function LearnersPage() {
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
                classesTaken: learner.total_sessions,
                subject: "N/A",
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

    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();

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

    return (
        <div className="w-full h-full p-6 animate-fadeIn">
             {mode === "message" && <MessageModal key={learnerId} learnerId={learnerId} isOpen={mode === "message"} onClose={handleClose} /> }
            <TestmonialModal
                isOpen={mode === "testimonial"}
                mode={"create"}
                onClose={handleClose}
            />
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
        </div>
    );
}
