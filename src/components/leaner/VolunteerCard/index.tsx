"use client";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Image from "next/image";
import CardChips from "./CardChips";
import Divider from "@/components/common/Divider";
import { FaStar } from "react-icons/fa";
import { SeeMoreIcon } from "@/assets/icons";

const VolunteerCard: React.FC<VolunteerCardProps> = ({
    onSeeMoreClick,
    volunteerId,
    languages,
    location,
    name,
    profileImage,
    studentConnected,
    subjects,
    volunteerHrs,
    totalReviews,
    overallRating,
}) => {
    const details = [
        { label: "Volunteer Hrs", value: volunteerHrs },
        { label: "Student connected", value: studentConnected },
        { label: "Subject", value: subjects.join(", ") },
        { label: "Language", value: languages.join(", ") },
    ];

    return (
        <div className="bg-white rounded-xl w-full shadow-sm h-fit p-4 flex flex-col gap-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <div className="w-[36px] h-[36px] rounded-full relative">
                    {profileImage !== "image_url" ? (
                        <Image
                            src={profileImage}
                            alt="avatar"
                            fill
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <Image
                            src={DummyProfileImg}
                            alt="avatar"
                            fill
                            className="w-full h-full object-cover rounded-full"
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <p className="text-base font-semibold lg:text-normal lg:font-medium">{name}</p>
                    <p className="text-sm font-medium">
                        <span className="text-gray-light capitalize">{location && `From ${location}`}</span>
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap gap-2.5">
                    <CardChips label="Volunteer Hrs" value={volunteerHrs || "0"} />
                </div>
                <div className="flex max-lg:flex-col gap-2.5">
                    <CardChips label="Student connected" value={studentConnected} />
                    <CardChips label="Subject" value={subjects.join(", ")} />
                </div>
                <div>
                    <CardChips label="Language" value={languages.join(", ")} />
                </div>
            </div>
            <Divider />
            <div className="flex items-center justify-between">
                <div className=" border-stroke border w-fit px-3 py-1.5 rounded-full">
                    <div className="flex items-center gap-2">
                        {overallRating ? (
                            <>
                                <FaStar className="text-[#FFC107]" />
                                <p className="text-sm font-medium ">
                                    {overallRating} - {totalReviews} Reviews
                                </p>
                            </>
                        ) : (
                            <p className="text-sm font-medium ">No Reviews</p>
                        )}
                    </div>
                </div>
                <span className="cursor-pointer" onClick={() => onSeeMoreClick(volunteerId)}>
                    <SeeMoreIcon />
                </span>
            </div>
        </div>
    );
};

export default VolunteerCard;
