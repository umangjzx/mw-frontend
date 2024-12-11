"use client";
import { endpoints } from "@/api/constants";
import { GetAPI } from "@/api/request";
import ClockIcon from "@/assets/icons/ClockIcon";
import ModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";
import LearnerConnectIcon from "@/assets/icons/LearnerConnectIcon";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Button from "@/components/common/Button";
import Divider from "@/components/common/Divider";
import ViewModal from "@/components/common/Modals/ViewModal";
import TagComponent from "@/components/common/Tag";
import OverViewCard from "@/components/leaner/LeanerOverViewCard";
import DetailCard from "@/components/profile/Bio/DetailCard";
import DetailChipCard from "@/components/profile/Bio/DetailChipCard";
import RatingCard from "@/components/profile/Overview/RatingCard";
import RatingHeader from "@/components/profile/Overview/RatingHeader";
import { getLocalStorage } from "@/utils/localStorage";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";

const ProfileHeader = ({ text, onClose }: { text: string | null; onClose: () => void }) => (
    <div className="flex items-center justify-between px-5">
        <p className="font-medium text-xl">Profile</p>
        <div className="flex items-center gap-2">
            <Button
                title="Schedule a meeting"
                className="text-sm !text-black !bg-[#dff5ff] !border-primary !border"
            />
            <span onClick={onClose} className="cursor-pointer">
                <ModalCloseIcon />
            </span>
        </div>
    </div>
);

interface VolunteerData {
    volunteer_first_name: string;
    volunteer_last_name: string;
    volunteer_description: string;
    volunteer_education: string;
    volunteer_experience: string;
    volunteer_languages: Array<{ language_name: string; language_id: string }>;
    volunteer_subjects: Array<{ subject_name: string; subject_id: string }>;
    volunteer_skills: Array<{ skill_name: string; skill_id: string }>;
    profile_picture: { image_url: string };
    volunteered_hours: number;
    students_connected: number;
}

const ProfileInfo = ({
    text,
    volunteerData,
}: {
    text: string | null;
    volunteerData: VolunteerData;
}) => (
    <div className="grid grid-cols-[1.7fr,2fr,2fr] gap-4 px-5">
        <div className="flex items-center gap-3">
            <div className="relative w-[80px] h-[80px] rounded-full shrink-0">
                <Image
                    src={volunteerData?.profile_picture?.image_url}
                    alt="avatar"
                    fill
                    className="object-cover rounded-full w-full h-full"
                />
            </div>
            <div className="flex flex-col gap-2">
                <p className="font-medium">
                    {`${volunteerData?.volunteer_first_name} ${volunteerData?.volunteer_last_name}`}
                </p>
                <TagComponent text={text} />
            </div>
        </div>
        <OverViewCard
            title="Hours Volunteered"
            value={volunteerData?.volunteered_hours}
            icon={<ClockIcon />}
        />
        <OverViewCard
            title="Students Connected"
            value={volunteerData?.students_connected}
            icon={<LearnerConnectIcon />}
        />
    </div>
);

const TabButtons = ({
    activeTab,
    handleTabChange,
}: {
    activeTab: string;
    handleTabChange: (tab: string) => void;
}) => (
    <div className="px-5">
        <div className="flex items-center justify-between border-stroke border-2 rounded-full">
            {["overview", "reviews"].map((tab) => (
                <div
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`font-medium text-center w-[50%] rounded-full py-2.5 px-5 ${
                        activeTab === tab
                            ? "bg-[#dff5ff] border-primary border-2"
                            : "border-2 border-transparent"
                    } transition-all duration-200 cursor-pointer`}
                >
                    {tab === "overview" ? "Overview" : "Reviews - 4.5 (120)️️"}
                </div>
            ))}
        </div>
    </div>
);

const OverviewContent = ({ volunteerData }: { volunteerData: VolunteerData }) => {
    const details = [
        {
            title: "Subjects I Teach",
            tags: volunteerData?.volunteer_subjects.map((subject) => subject.subject_name),
        },
        {
            title: "Languages I Speak",
            tags: volunteerData?.volunteer_languages.map((lang) => lang.language_name),
        },
        {
            title: "Skills",
            tags: volunteerData?.volunteer_skills.map((skill) => skill.skill_name),
        },
    ];

    const bio = [
        {
            title: "Experience",
            description: volunteerData?.volunteer_experience,
        },
        {
            title: "Education",
            description: volunteerData?.volunteer_education,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="px-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <p className="font-medium">Bio</p>
                    <TagComponent
                        text="Los Angeles, CA"
                        className="text-sm py-1 font-medium px-2"
                        icon={<FaLocationDot />}
                    />
                </div>
                <p className="text-sm text-gray-light font-normal">
                    {volunteerData?.volunteer_description}
                </p>
            </div>
            {details.map((detail, index) => (
                <DetailChipCard
                    key={index}
                    className="!gap-2"
                    tags={detail?.tags}
                    title={detail?.title}
                />
            ))}
            {bio.map((item, index) => (
                <DetailCard
                    key={index}
                    className="!gap-2"
                    title={item?.title}
                    description={item?.description}
                />
            ))}
        </div>
    );
};

const ReviewsContent = ({ ratingCard }: { ratingCard: any }) => (
    <div className="flex flex-col gap-3">
        <div className="px-5">
            <div className="flex flex-col gap-5">
                <RatingHeader />
                {[...Array(3)].map((_, index) => (
                    <RatingCard key={index} {...ratingCard} />
                ))}
            </div>
        </div>
    </div>
);

const VolunteerViewModal: React.FC<VolunteerViewModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const text = getLocalStorage("role");
    const searchParams = useSearchParams();
    const volunteerId = searchParams.get("volunteerId");

    console.log(volunteerId, "volunteerId Modal");

    const getIndividualVolunteer = async () => {
        const response: any = await GetAPI(
            endpoints.volunteer.getIndividualVolunteer(volunteerId as string)
        );
        return response.data;
    };

    const {
        data: volunteerData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["volunteer", volunteerId],
        queryFn: getIndividualVolunteer,
        enabled: !!volunteerId,
    });

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

    if (isLoading) {
        return <div></div>;
    }

    if (isError) {
        return (
            <ViewModal modalOpen={isOpen} onClose={onClose} width={855}>
                <div className="p-5">Error loading volunteer data</div>
            </ViewModal>
        );
    }

    return (
        <ViewModal modalOpen={isOpen} onClose={onClose} width={855}>
            <div className="flex flex-col gap-4 py-4">
                <ProfileHeader text={text} onClose={onClose} />
                <Divider />
                <ProfileInfo text={text} volunteerData={volunteerData} />
                <Divider />
                <TabButtons activeTab={activeTab} handleTabChange={handleTabChange} />
                <div className="relative">
                    <div
                        className={`transform transition-all duration-300 ${
                            activeTab === "overview"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-8 absolute top-0 left-0 right-0"
                        }`}
                    >
                        {activeTab === "overview" && (
                            <OverviewContent volunteerData={volunteerData} />
                        )}
                    </div>
                    <div
                        className={`transform transition-all duration-300 ${
                            activeTab === "reviews"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-8 absolute top-0 left-0 right-0"
                        }`}
                    >
                        {activeTab === "reviews" && <ReviewsContent ratingCard={ratingCard} />}
                    </div>
                </div>
            </div>
        </ViewModal>
    );
};

export default VolunteerViewModal;
