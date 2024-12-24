"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Bio from "@/components/profile/Bio";
import Overview from "@/components/profile/Overview";
import { useComponentStore } from "@/store/useComponenetStore";
import { useQuery } from "@tanstack/react-query";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import Cookies from "js-cookie";

export default function ProfilePage() {
    const { setHeaderOptions } = useComponentStore();
    const router = useRouter();
    const learnerId = Cookies.get("learner_id");

    const getLearnerProfile = async () => {
        const response = await GET_API(endpoints.learner.getIndividualLearner(learnerId as string));
        return response;
    };

    const { data } = useQuery({
        queryKey: ["learner-profile"],
        queryFn: () => getLearnerProfile(),
    });

    const handleBackClick = () => {
        router.back();
    };

    useEffect(() => {
        setHeaderOptions({
            title: "Profile",
            titleIcon: <IoIosArrowBack className="text-lg" />,
            titleIconClick: handleBackClick,
            showButton: false,
        });
    }, []);

    return (
        <div className="h-full animate-fadeIn">
            <div className="h-full w-full grid grid-cols-[1fr,2fr] gap-10 p-5">
                <Bio />
                <Overview />
            </div>
        </div>
    );
}
