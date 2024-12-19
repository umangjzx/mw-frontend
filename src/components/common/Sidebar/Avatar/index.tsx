"use client";
import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import TagComponent from "@/components/common/Tag";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Avatar = () => {
    const role = Cookies.get("role");
    const volunteerId = Cookies.get("volunteer_id");
    const learnerId = Cookies.get("learner_id");
    const [userName, setUserName] = useState("");
    const {
        setLearnerName,
        setVolunteerName,
        setLearnerImage,
        setVolunteerImage,
        learnerImage,
        volunteerImage,
    } = useAppStore();
    const image = role === "volunteer" ? volunteerImage : learnerImage;
    const getUserName = async () => {
        const endpoint =
            role === "volunteer"
                ? endpoints.volunteer.getIndividualVolunteer(volunteerId as string)
                : endpoints.learner.getIndividualLearner(learnerId as string);
        const response = await GET_API(endpoint);
        console.log(response?.data?.profile_picture?.image_url, "SIDEBAR RESPONSE");

        if (response.data) {
            if (role === "learner") {
                const learnerName =
                    response.data.learner_personal_info.learner_first_name +
                    " " +
                    response.data.learner_personal_info.learner_last_name;
                setUserName(learnerName);
                setLearnerName(learnerName);
                setLearnerImage(response.data.profile_picture?.image_url);
            } else {
                const volunteerName =
                    response.data.volunteer_first_name + " " + response.data.volunteer_last_name;
                setUserName(volunteerName);
                setVolunteerName(volunteerName);
                setVolunteerImage(response.data.profile_picture?.image_url);
            }
        }
    };

    const { data: volunteerData } = useQuery({
        queryKey: ["volunteer"],
        queryFn: () => getUserName(),
    });

    return (
        <Link href={"profile"} className="flex flex-col items-center gap-2 p-2">
            <div className="relative w-[80px] h-[80px]">
                <Image src={image} alt="avatar" fill className="object-cover rounded-full" />
            </div>
            <p className="font-medium">{userName}</p>
            <TagComponent text={role || ""} />
        </Link>
    );
};

export default Avatar;
