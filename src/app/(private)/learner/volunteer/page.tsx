"use client";

import { getHeaderIcon } from "@/layouts/helper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
import CalendarAccessScreen from "@/components/common/CalendarAccessScreen";

interface VolunteerCardData {
    volunteerId: string;
    profileImage: string;
    name: string;
    location: string;
    volunteerHrs: string;
    studentConnected: string;
    subjects: string[];
    languages: string[];
    totalReviews: string;
    overallRating: string;
}

export default function LearnersPage() {
    const { setHeaderOptions } = useComponentStore();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [volunteerCardData, setVolunteerCardData] = useState<VolunteerCardData[]>([]);
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [size] = useQueryState("size", { defaultValue: "10" });
    const [page] = useQueryState("page", { defaultValue: "1" });
    const [query] = useQueryState("query");
    const [language_ids] = useQueryState("language_ids");
    const [subject_ids] = useQueryState("subject_ids");
    const [start_date] = useQueryState("start_date");
    const [end_date] = useQueryState("end_date");
    const [start_time] = useQueryState("start_time");
    const [end_time] = useQueryState("end_time");

    const getAllVolunteers = async () => {
        const endpoint = `${endpoints.volunteer.getAllVolunteers}?${new URLSearchParams({
            query: query || "",
            page: page,
            size: size,
            language_ids: language_ids || "",
            subject_ids: subject_ids || "",
            start_date: start_date || "",
            end_date: end_date || "",
            start_time: start_time || "",
            end_time: end_time || "",
        })}`;
        const response: any = await GET_API(endpoint);
        return response.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: [
            "volunteer",
            query,
            page,
            size,
            language_ids,
            subject_ids,
            start_date,
            end_date,
            start_time,
            end_time,
        ],
        queryFn: () => getAllVolunteers(),
        enabled: true,
    });

    useEffect(() => {
        if (data?.items) {
            const formattedData: VolunteerCardData[] = data.items.map((volunteer: any) => ({
                volunteerId: volunteer.volunteer_id,
                profileImage: volunteer.profile_picture.image_url,
                name: `${volunteer.volunteer_first_name} ${volunteer.volunteer_last_name}`,
                location: "Not Available", // Add location if available in API
                volunteerHrs: volunteer.total_volunteered_hours?.toString(),
                studentConnected: volunteer.students_connected?.toString(),
                subjects: volunteer.volunteer_subjects.map((subject: any) => subject.subject_name),
                languages: volunteer.volunteer_languages.map(
                    (language: any) => language.language_name
                ),
                totalReviews: volunteer.total_reviews,
                overallRating: volunteer.overall_rating,
            }));
            setVolunteerCardData(formattedData);
        }
    }, [data]);

    const handleModal = () => {
        router.push("/learner/volunteer");
    };

    const handleSeeMoreClick = (volunteerId: string) => {
        router.push(`/learner/volunteer?volunteerId=${volunteerId}`);
    };

    useEffect(() => {
        const volunteerId = searchParams.get("volunteerId");
        const modal = searchParams.get("modal");

        if (modal === "add_new_meeting") {
            setIsOpenSchedule(true);
            setIsOpen(false);
        } else if (volunteerId) {
            setIsOpen(true);
            setIsOpenSchedule(false);
        } else {
            setIsOpen(false);
            setIsOpenSchedule(false);
        }
    }, [searchParams]);

    useEffect(() => {
        setHeaderOptions({
            searchPlaceholder: "Find your tutor",
            actionButtonPlacement: "right",
            title: "Volunteer",
            titleIcon: getHeaderIcon(pathname),
            actionButtons: [
                {
                    buttonTitle: "Volunteers I have worked with",
                    buttonOnClick: () => router.push("/learner/my-volunteers"),
                    buttonClassName: "!bg-black !text-white hover:!bg-black hover:!text-white !h-[35px] !text-sm !py-2 px-4 !rounded-full",
                    buttonPlacement: "right",
                    showButton: true,
                },
                {
                    buttonTitle: "Filters",
                    buttonOnClick: () => setIsFilterOpen(true),
                    buttonIcon: <RiFilter3Line className="text-lg" />,
                    buttonClassName: "!bg-white !text-balck hover:!bg-black hover:!text-white !h-[35px] !text-sm !py-2 px-4 !rounded-full",
                    buttonPlacement: "right",
                    showButton: true,
                }
            ]
        });
    }, [pathname, setHeaderOptions]);

    return (
        <div className="px-10 py-10 animate-fadeIn">
            <AddNewMeetingModal isOpen={isOpenSchedule} onClose={handleModal} />
            <VolunteerViewModal isOpen={isOpen} onClose={handleModal} />
            <VolunteerFilterModal
                isFilterApplying={false}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div>Error loading volunteers</div>
            ) : (
                <div className="grid grid-cols-3 gap-4 w-full">
                    {volunteerCardData.map((volunteer) => (
                        <VolunteerCard
                            key={volunteer.volunteerId}
                            onSeeMoreClick={handleSeeMoreClick}
                            {...volunteer}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
