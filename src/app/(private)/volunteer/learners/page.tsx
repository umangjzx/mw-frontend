"use client";

import { endpoints } from "@/api/constants";
import { GetAPI } from "@/api/request";
import { MessageModal, TestmonialModal } from "@/components/learners/Modals";
import LearnersTable from "@/components/learners/Table";
import { getHeaderIcon } from "@/layouts/helper";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

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

    const getAllLearners = async ({ page, size }: PaginationParams) => {
        const response: any = await GetAPI(
            `${endpoints.learner.getAllLearners}?page=${page}&size=${size}`
        );
        return response.data;
    };

    const { data: learners, isLoading } = useQuery({
        queryKey: ["learners", pagination.page, pagination.size],
        queryFn: () => getAllLearners(pagination),
    });

    useEffect(() => {
        if (learners?.items) {
            const transformedData = learners.items.map((learner: any) => ({
                id: learner.learner_id,
                name: `${learner.learner_personal_info.learner_first_name} ${learner.learner_personal_info.learner_last_name}`,
                classesTaken: learner.total_classes_attended,
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

    const { setHeaderOptions } = useAppStore();
    const pathname = usePathname();

    const [_, setLearnerId] = useQueryState("id", {
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
        <div className="w-full h-full p-6">
            <MessageModal isOpen={mode === "message"} onClose={handleClose} />
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
