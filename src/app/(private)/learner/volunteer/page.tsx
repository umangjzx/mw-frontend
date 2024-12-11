"use client";

import { getHeaderIcon } from "@/layouts/helper";
import { useAppStore } from "@/store/useAppStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import VolunteerCard from "@/components/leaner/VolunteerCard";
import VolunteerViewModal from "@/components/leaner/VolunteerViewModal";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";

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
    const { setHeaderOptions } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [volunteerCardData, setVolunteerCardData] = useState<VolunteerCardData[]>([]);

    const getAllVolunteers = async () => {
        const response: any = await GET_API(endpoints.volunteer.getAllVolunteers);
        return response.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["volunteer"],
        queryFn: () => getAllVolunteers(),
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
        isOpen ? router.push("/learner/volunteer") : setIsOpen(!isOpen);
    };

    const handleSeeMoreClick = (volunteerId: string) => {
        router.push(`/learner/volunteer?volunteerId=${volunteerId}`);
    };

    useEffect(() => {
        const volunteerId = searchParams.get("volunteerId");
        if (volunteerId) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [searchParams]);

    useEffect(() => {
        setHeaderOptions({
            searchPlaceholder: "Find your tutor",
            actionButtonTitle: "My Volunteers",
            actionButtonOnClick: () => {},
            actionButtonClassName:
                "!bg-black hover:!border-none !text-white !rounded-xl hover:!bg-black hover:!text-white !h-[35px] !text-xs !py-2 px-4",
            actionButtonPlacement: "right",
            hideButton: false,
            title: "Volunteer",
            titleIcon: getHeaderIcon(pathname),
        });
    }, [pathname, setHeaderOptions]);

    return (
        <div className="grid grid-cols-3 gap-4 px-10 py-10">
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
