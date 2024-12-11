"use client";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Image from "next/image";

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
                <div className="w-[64px] h-[64px] rounded-full relative">
                    <Image
                        src={profileImage}
                        alt="avatar"
                        fill
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-medium">{name}</p>
                    <p className="font-medium text-sm text-gray-light">Location: {location}</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
                {details.map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-2">
                        <p className="font-medium text-xs text-gray-light">{label}</p>
                        <p className="font-medium text-sm">{value}</p>
                    </div>
                ))}
            </div>
            <p
                className="text-sm text-primary font-medium underline cursor-pointer hover:opacity-70 transition-all duration-300"
                onClick={() => onSeeMoreClick(volunteerId)}
            >
                See more
            </p>
        </div>
    );
};

export default VolunteerCard;
