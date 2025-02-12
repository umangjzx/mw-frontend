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
import MobileProfileView from "@/components/profile/MobileProfileView";
import InnerWidth from "@/utils/innerWidth";
import EditProfileModal from "@/components/profile/EditProfile";
import { useQueryState } from "nuqs";

export default function ProfilePage() {
    const { setHeaderOptions } = useComponentStore();
    const { setLearnerDetails } = useAppStore();
    const router = useRouter();
    const isMobileOrTabScreen = InnerWidth() < 1024;
    const [mode, setMode] = useQueryState("mode");

    const learnerId = Cookies.get("learner_id") || "";
    const [editProfileData, setEditProfileData] = useState({});
    const [learnerData, setLearnerData] = useState({ bio: {}, overview: {} });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["learner", learnerId],
        queryFn: () => getIndividualLearner(learnerId),
        enabled: !!learnerId
    });
    const triggerReload = async () => await refetch();

    useEffect(() => {
        setHeaderOptions({
            title: "Profile",
            titleIcon: <IoIosArrowBack className="text-lg" />,
            titleIconClick: () => router.back(),
            actionButtonTitle: "Edit Profile",
            actionButtonClassName:
                "lg:hidden !bg-black !text-white !rounded-xl hover:!bg-black hover:!text-white !h-[35px] !text-sm !py-2 px-4",
            actionButtonOnClick: () => setMode("edit"),
            actionButtonVariant: "secondary",
            actionButtonPlacement: "right",
            showButton: true,
            showTitleButton: true,
            hideSearch: true
        });
    }, []);

    useEffect(() => {
        if (!data) return;
        setLearnerDetails(data);

        const learner_first_name = data?.learner_personal_info?.learner_first_name;
        const learner_last_name = data?.learner_personal_info?.learner_last_name;
        const learner_primary_language = data?.learner_personal_info?.learner_primary_language;
        const description = data?.learner_special_needs?.description;
        const subjects = data?.learner_goals?.subjects_to_focus_on;
        const contactDetail = data?.learner_personal_info?.learner_contact_details;

        setEditProfileData({
            userId: learnerId,
            learner_first_name: learner_first_name,
            learner_last_name: learner_last_name,
            learner_description: description,
            profile_picture: data?.profile_picture,
            learner_subjects: subjects,
            learner_language: learner_primary_language,
            contact_number: contactDetail?.contact_number,
            email: contactDetail?.email,
            country: contactDetail?.country,
        })

        const bioData = {
            userId: learnerId,
            full_name: `${learner_first_name} ${learner_last_name}`,
            bio_description: description,
            profile_picture: data?.profile_picture?.image_url,
            subjects: subjects,
            languages: learner_primary_language,
            phone_number: `${contactDetail?.contact_number?.country_code} ${contactDetail?.contact_number?.number}`,
            country: contactDetail?.country,
            gender: data?.learner_personal_info?.learner_gender,
            email: contactDetail?.email,
            connections: data?.total_volunteers_connected,
            total_hours: data?.total_attended_hours,
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
            <EditProfileModal
                data={editProfileData}
                isOpen={mode === "edit"}
                onClose={() => setMode(null)}
                triggerReload={triggerReload}
            />
            {
                isMobileOrTabScreen ?
                    <MobileProfileView
                        userData={learnerData?.bio}
                        reviewEndpoint={endpoints.learnerFeedback.get(learnerId)}
                    />
                    :
                    <div className="h-full w-full grid grid-cols-[1fr,2fr] gap-10 p-5">
                        <Bio data={learnerData.bio} />
                        <Overview data={learnerData.overview} reviewEndpoint={endpoints.learnerFeedback.get(learnerId)} />
                    </div>
            }
        </div>
    );
}
