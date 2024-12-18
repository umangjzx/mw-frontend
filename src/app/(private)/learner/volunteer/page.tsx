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

interface VolunteerCardData {
    volunteerId: string;
    profileImage: string;
    name: string;
    location: string;
    volunteerHrs: string;
    studentConnected: string;
    subjects: string[];
    languages: string[];
}

export default function LearnersPage() {
    const { setHeaderOptions } = useComponentStore();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [volunteerCardData, setVolunteerCardData] = useState<VolunteerCardData[]>([]);
    const [isOpenSchedule, setIsOpenSchedule] = useState(false);
    const [size] = useQueryState("size", { defaultValue: "10" });
    const [page] = useQueryState("page", { defaultValue: "1" });
    const [query] = useQueryState("query");

    const getAllVolunteers = async () => {
        const endpoint = `${endpoints.volunteer.getAllVolunteers}?${new URLSearchParams({
            query: query || "",
            page: page,
            size: size,
        })}`;
        const response: any = await GET_API(endpoint);
        return response.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["volunteer", query, page, size],
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
                volunteerHrs: volunteer.volunteered_hours.toString(),
                studentConnected: volunteer.students_connected.toString(),
                subjects: volunteer.volunteer_subjects.map((subject: any) => subject.subject_name),
                languages: volunteer.volunteer_languages.map(
                    (language: any) => language.language_name
                ),
            }));
            setVolunteerCardData(formattedData);
        }
    }, [data]);

    console.log(volunteerCardData, "Volunteer Data");

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
            // actionButtonTitle: "My Volunteers",
            // actionButtonOnClick: () => {},
            // actionButtonClassName:
            //     "!bg-black hover:!border-none !text-white !rounded-xl hover:!bg-black hover:!text-white !h-[35px] !text-xs !py-2 px-4",
            // actionButtonPlacement: "right",
            // showButton: true,
            title: "Volunteer",
            titleIcon: getHeaderIcon(pathname),
        });
    }, [pathname, setHeaderOptions]);

    return (
        <div className="grid grid-cols-3 gap-4 px-10 py-10">
            <AddNewMeetingModal isOpen={isOpenSchedule} onClose={handleModal} />
            <VolunteerViewModal isOpen={isOpen} onClose={handleModal} />
            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div>Error loading volunteers</div>
            ) : (
                volunteerCardData.map((volunteer) => (
                    <VolunteerCard
                        key={volunteer.volunteerId}
                        onSeeMoreClick={handleSeeMoreClick}
                        {...volunteer}
                    />
                ))
            )}
        </div>
    );
}
