"use client";

import { getHeaderIcon } from "@/layouts/helper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import VolunteerCard from "@/components/leaner/VolunteerCard";
import VolunteerViewModal from "@/components/leaner/VolunteerViewModal";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useComponentStore } from "@/store/useComponenetStore";
import AddNewMeetingModal from "@/components/schedule/Modals/AddNewMeetingModal";
import { useQueryState } from "nuqs";
import VolunteerFilterModal from "@/components/learners/Modals/VolunteerFilter";
import { RiFilter3Line } from "react-icons/ri";
import LottieLoader from "@/components/common/Loader/Lottie";
import InnerWidth from "@/utils/innerWidth";
import { useDebounce } from "use-debounce";
import LearnerCard from "@/components/leaner/LearnerCard";
interface LearnerCardData {
    learnerId: string;
    profileImage: string;
    name: string;
    location: string;
    learnerHrs: string;
    studentConnected: string;
    subjects: string[];
    languages: string;
    totalReviews: string;
    overallRating: string;
    developementDisability: string;
}

export default function LearnersPage() {
    const { setHeaderOptions } = useComponentStore();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [learnerCardData, setLearnerCardData] = useState<LearnerCardData[]>([]);
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [size] = useQueryState("size", { defaultValue: "10" });
    const [page] = useQueryState("page", { defaultValue: "1" });
    const [searchQuery, setSearchQuery] = useQueryState("query");
    const [language_ids] = useQueryState("language_ids");
    const [subject_ids] = useQueryState("subject_ids");
    const [country] = useQueryState("country");
    const [start_date] = useQueryState("start_date");
    const [end_date] = useQueryState("end_date");
    const [start_time] = useQueryState("start_time");
    const [end_time] = useQueryState("end_time");
    const [learnerId, setLearnerId] = useQueryState("learnerId");
    const [modalQuery, setModalQuery] = useQueryState("modal");

    const isMobileScreen = InnerWidth() < 768;

    const [query] = useDebounce(searchQuery, 500);
    const { data, isLoading, isError } = useQuery({
        queryKey: [
            "volunteer",
            query,
            page,
            size,
            country,
            language_ids,
            subject_ids,
            start_date,
            end_date,
            start_time,
            end_time,
        ],
        queryFn: async () => {
            const endpoint = `${endpoints.learner.getAllLearners}?${new URLSearchParams({
                query: query || "",
                page: page,
                size: size,
                // language_ids: language_ids || "",
                // subject_ids: subject_ids || "",
                // country: country || "",
                // start_date: start_date || "",
                // end_date: end_date || "",
                // start_time: start_time || "",
                // end_time: end_time || "",
            })}`;
            const response: any = await GET_API(endpoint);
            return response.data;
        },
        enabled: true,
    });

    const appliedFiltersCount = useMemo(() => {
        const filters = [language_ids, subject_ids, country, start_date, start_time];
        return filters.filter((filter) => filter).length;
    }, [language_ids, subject_ids, country, start_date, start_time]);

    useEffect(() => {
        if (data) {
            const formattedData: LearnerCardData[] = data.map((learner: any) => ({
                learnerId: learner?.learner_id,
                profileImage: learner?.profile_picture?.image_url,
                name: `${learner?.learner_personal_info?.learner_first_name} ${learner?.learner_personal_info?.learner_last_name}`,
                location: learner?.learner_personal_info?.learner_contact_details?.country,
                learnerHrs: learner?.total_classes_attended?.toString(),
                studentConnected: learner?.students_connected?.toString(),
                subjects: learner?.learner_subjects?.map((subject: any) => subject?.subject_name),
                languages: learner?.learner_personal_info?.learner_primary_language,
                totalReviews: learner?.total_reviews,
                overallRating: learner?.overall_rating,
                chatPermission: learner?.chat_permission,
                developementDisability:
                    learner?.learner_special_needs?.type_of_developmental_disability,
            }));
            setLearnerCardData(formattedData);
            console.log(formattedData, "formattedData");
        }
    }, [data]);

    const handleModal = () => {
        setLearnerId(null);
        setModalQuery(null);
    };

    const handleSeeMoreClick = (learnerId: string) => {
        setLearnerId(learnerId);
    };

    useEffect(() => {
        const modal = searchParams.get("modal");

        if (modal === "add_new_meeting") {
            setIsOpenSchedule(true);
            setIsOpen(false);
        } else if (learnerId) {
            setIsOpen(true);
            setIsOpenSchedule(false);
        } else {
            setIsOpen(false);
            setIsOpenSchedule(false);
        }
    }, [searchParams, learnerId]);

    useEffect(() => {
        setHeaderOptions({
            searchPlaceholder: "Find your learner",
            actionButtonPlacement: "right",
            title: "Learners",
            titleIcon: getHeaderIcon(pathname),
            actionButtons: [
                {
                    buttonTitle: isMobileScreen
                        ? "Learners History"
                        : "Learners I have worked with",
                    buttonOnClick: () => router.push("/volunteer/my-learners"),
                    buttonClassName:
                        "!bg-black !text-white hover:!bg-black hover:!text-white !h-[35px] !text-sm !py-2 px-4 !rounded-full",
                    buttonPlacement: "right",
                    showButton: true,
                },
            ],
        });
    }, [pathname, setHeaderOptions, appliedFiltersCount]);

    return (
        <div className="h-full animate-fadeIn">
            <AddNewMeetingModal isOpen={isOpenSchedule} onClose={handleModal} />
            <VolunteerViewModal isOpen={isOpen} onClose={handleModal} />
            <VolunteerFilterModal
                isFilterApplying={false}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
            {isLoading ? (
                <LottieLoader isLoading={true} />
            ) : isError ? (
                <div className="flex-center h-full w-full">Something went wrong</div>
            ) : (
                <>
                    {learnerCardData.length === 0 ? (
                        <div className="flex-center h-full w-full flex-col gap-1">
                            <p>No Learners Found</p>
                            {query && (
                                <button
                                    className="text-blue-500 underline"
                                    onClick={() => setSearchQuery(null)}
                                >
                                    Clear Search
                                </button>
                            )}
                            {appliedFiltersCount > 0 && (
                                <button
                                    className="text-blue-500 underline"
                                    onClick={() => router.push("/learner/volunteer")}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-auto p-5 py-7 lg:p-10">
                            {learnerCardData.map((learner) => (
                                <LearnerCard
                                    key={learner.learnerId}
                                    onSeeMoreClick={handleSeeMoreClick}
                                    {...learner}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
