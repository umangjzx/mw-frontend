"use client";
import ClockIcon from "@/assets/icons/ClockIcon";
import ModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";
import LearnerConnectIcon from "@/assets/icons/LearnerConnectIcon";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Button from "@/components/common/Button";
import Divider from "@/components/common/Divider";
import ViewModal from "@/components/common/Modals/ViewModal";
import TagComponent from "@/components/common/Tag";
import DetailCard from "@/components/profile/Bio/DetailCard";
import DetailChipCard from "@/components/profile/Bio/DetailChipCard";
import RatingCard from "@/components/profile/Overview/RatingCard";
import OverViewCard from "@/components/leaner/LeanerOverViewCard";
import { getLocalStorage } from "@/utils/localStorage";
import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import RatingHeader from "@/components/profile/Overview/RatingHeader";
const VolunteerViewModal = () => {
    const text = getLocalStorage("role");

    const subjects = [
        "Math",
        "Science",
        "English",
        "History",
        "Art",
        "Music",
        "Physical Education",
    ];

    const languages = ["English", "Spanish", "French", "German", "Italian", "Japanese"];
    const skills = [
        "Teaching",
        "Music Therapy",
        "Language Development",
        "Creativity",
        "Confidence",
    ];

    const details = [
        { title: "Subjects I Teach", tags: subjects },
        { title: "Languages I Speak", tags: languages },
        { title: "Skills", tags: skills },
    ];

    const bio = [
        {
            title: "Experience",
            description:
                "Led weekly music sessions for children with special needs, focusing on rhythm, melody, and emotional expression.",
        },
        {
            title: "Education",
            description:
                "Bachelor's degree in Music Therapy from the University of California, Los Angeles.",
        },
    ];

    const overViewCard = [
        {
            title: "Hours Volunteered",
            value: 40,
            icon: <ClockIcon />,
        },
        {
            title: "Students Connected",
            value: 40,
            icon: <LearnerConnectIcon />,
        },
    ];

    const [activeTab, setActiveTab] = useState("overview");

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const ratingCard = {
        profileImg: DummyProfileImg,
        name: "Vinoth Kumar",
        rating: 4.5,
        day: "1d",
        review: "Jane was so patient and attentive with my child. She made learning fun and engaging, and I could see real progress in just a few weeks!",
    };

    return (
        <ViewModal modalOpen={true} onClose={() => {}} width={855}>
            <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center justify-between px-5 ">
                    <p className="font-medium text-xl">Profile</p>
                    <div className="flex items-center gap-2">
                        <Button
                            title="Schedule a meeting"
                            className="text-sm !text-black !bg-[#dff5ff] !border-primary !border"
                        />
                        <ModalCloseIcon />
                    </div>
                </div>
                <Divider />

                <div className="grid grid-cols-[1.7fr,2fr,2fr] gap-4 px-5">
                    <div className="flex items-center gap-3 ">
                        <Image src={DummyProfileImg} alt="avatar" width={80} height={80} />
                        <div className="flex flex-col gap-2">
                            <p className="font-medium">Alexander Harris</p>
                            <TagComponent text={text} />
                        </div>
                    </div>
                    {overViewCard.map((item, index) => (
                        <OverViewCard
                            key={index}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                        />
                    ))}
                </div>
                <Divider />
                <div className="px-5">
                    <div className="flex items-center justify-between border-stroke border-2 rounded-full ">
                        <div
                            onClick={() => handleTabChange("overview")}
                            className={`font-medium text-center w-[50%] rounded-full py-2.5 px-5  ${
                                activeTab === "overview"
                                    ? " bg-[#dff5ff] border-primary border-2"
                                    : "border-2 border-transparent"
                            } transition-all duration-200 cursor-pointer`}
                        >
                            Overview
                        </div>
                        <div
                            onClick={() => handleTabChange("reviews")}
                            className={`font-medium text-center w-[50%] rounded-full py-2.5 px-5  ${
                                activeTab === "reviews"
                                    ? " border-primary bg-[#dff5ff] border-2"
                                    : "border-2 border-transparent"
                            } transition-all duration-200 cursor-pointer`}
                        >
                            Reviews - 4.5 (120)️️
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div
                        className={`transform transition-all duration-300 ${
                            activeTab === "overview"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-8 absolute top-0 left-0 right-0"
                        }`}
                    >
                        {activeTab === "overview" && (
                            <div className="flex flex-col gap-3">
                                <div className="px-5 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-xl">Bio</p>
                                        <TagComponent
                                            text="Los Angeles, CA"
                                            className="text-sm py-1 font-medium px-2"
                                            icon={<FaLocationDot />}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-light font-normal">
                                        Passionate educator with over 5 years of experience working
                                        with children of all abilities. I specialize in personalized
                                        learning plans, with a focus on music therapy and language
                                        development, aimed at fostering creativity and confidence.
                                    </p>
                                </div>
                                {details.map((detail) => (
                                    <DetailChipCard tags={detail.tags} title={detail.title} />
                                ))}
                                {bio.map((item) => (
                                    <DetailCard title={item.title} description={item.description} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        className={`transform transition-all duration-300 ${
                            activeTab === "reviews"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-8 absolute top-0 left-0 right-0"
                        }`}
                    >
                        {activeTab === "reviews" && (
                            <div className="flex flex-col gap-3">
                                <div className="px-5">
                                    <RatingHeader />
                                    <div className="flex flex-col gap-3">
                                        <RatingCard {...ratingCard} />
                                        <RatingCard {...ratingCard} />
                                        <RatingCard {...ratingCard} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ViewModal>
    );
};

export default VolunteerViewModal;
