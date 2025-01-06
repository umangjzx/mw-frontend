"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Bio from "@/components/profile/Bio";
import Overview from "@/components/profile/Overview";
import { useComponentStore } from "@/store/useComponenetStore";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getIndividualLearner } from "@/api/learners";
import { useAppStore } from "@/store/useAppStore";
import { endpoints } from "@/api/constants";
import LottieLoader from "@/components/common/Loader/Lottie";

export default function ProfilePage() {
    const { setHeaderOptions } = useComponentStore();
    const { setLearnerDetails } = useAppStore();
    const router = useRouter();

    const learnerId = Cookies.get("learner_id") || "";
    const [learnerData, setLearnerData] = useState({ bio: {}, overview: {} });

    const { data, isLoading } = useQuery({
        queryKey: ["learner", learnerId],
        queryFn: () => getIndividualLearner(learnerId),
        enabled: !!learnerId
    });

    useEffect(() => {
        setHeaderOptions({
            title: "Profile",
            titleIcon: <IoIosArrowBack className="text-lg" />,
            titleIconClick: () => router.back(),
            showButton: false,
            hideSearch: true
        });
    }, []);

    useEffect(() => {
        if (!data) return;
        setLearnerDetails(data);

        const contactDetail = data?.learner_personal_info?.learner_contact_details

        const bioData = {
            full_name: `${data?.learner_personal_info?.learner_first_name} ${data?.learner_personal_info?.learner_last_name}`,
            bio_description: data?.learner_special_needs?.description,
            profile_picture: data?.profile_picture?.image_url,
            subjects: data?.learner_goals?.subjects_to_focus_on,
            languages: data?.learner_personal_info?.learner_primary_language,
            phone_number: `${contactDetail?.contact_number?.country_code} ${contactDetail?.contact_number?.number}`,
            email: contactDetail?.email
        };

        const overviewData = {
            connections: data?.total_volunteers_connected,
            total_hours: data?.total_attended_hours,
        };

        setLearnerData({ bio: bioData, overview: overviewData });
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
                <Bio data={learnerData.bio} />
                <Overview data={learnerData.overview} reviewEndpoint={endpoints.learnerFeedback.get(learnerId)} />
            </div>
        </div>
    );
}
