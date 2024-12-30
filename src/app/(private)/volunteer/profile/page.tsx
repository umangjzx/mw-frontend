"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Bio from "@/components/profile/Bio";
import Overview from "@/components/profile/Overview";
import { useComponentStore } from "@/store/useComponenetStore";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getIndividualVolunteer } from "@/api/volunteers";
import { useAppStore } from "@/store/useAppStore";
import { endpoints } from "@/api/constants";
import LottieLoader from "@/components/common/Loader/Lottie";

export default function ProfilePage() {
    const { setHeaderOptions } = useComponentStore();
    const { setVolunteerDetails } = useAppStore();
    const router = useRouter();

    const volunteerId = Cookies.get("volunteer_id") || "";
    const [volunteerData, setVolunteerData] = useState({ bio: {}, overview: {} });

    const { data, isLoading } = useQuery({
        queryKey: ["volunteer", volunteerId],
        queryFn: () => getIndividualVolunteer(volunteerId),
        enabled: !!volunteerId
    });

    useEffect(() => {
        setHeaderOptions({
            title: "Profile",
            titleIcon: <IoIosArrowBack className="text-lg" />,
            titleIconClick: () => router.back(),
            showButton: false,
        });
    }, []);

    useEffect(() => {
        if (!data) return;
        setVolunteerDetails(data);

        const bioData = {
            full_name: `${data?.volunteer_first_name} ${data?.volunteer_last_name}`,
            bio_description: data?.volunteer_description,
            profile_picture: data?.profile_picture?.image_url,
            subjects: data?.volunteer_subjects?.map((subject: any) => subject?.subject_name),
            languages: data?.volunteer_languages?.map((language: any) => language?.language_name),
            skills: data?.volunteer_skills?.map((skill: any) => skill?.skill_name),
            experience: data?.volunteer_experience,
            education: data?.volunteer_education,
        };

        const overviewData = {
            connections: data?.students_connected,
            total_hours: data?.total_volunteered_hours,
        };

        setVolunteerData({ bio: bioData, overview: overviewData });
    }, [data]);

    if (isLoading) {
        return <>
            <div className="h-full w-full flex-center">
                <LottieLoader isLoading={isLoading} />
            </div>
        </>
    }

    return (
        <div className="h-full animate-fadeIn">
            <div className="h-full w-full grid grid-cols-[1fr,2fr] gap-10 p-5">
                <Bio data={volunteerData.bio} />
                <Overview data={volunteerData.overview} reviewEndpoint={endpoints.volunterFeedback.get(volunteerId)} />
            </div>
        </div>
    );
}