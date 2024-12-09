"use client";
import DummyProfileImg from "@/assets/images/DummyProfileImg.png";
import Image from "next/image";

const VolunteerCard = () => {
    const details = [
        { label: "Volunteer Hrs", value: "100" },
        { label: "Student connected", value: "40" },
        { label: "Subject", value: "Math" },
        { label: "Language", value: "English, Spanish" },
    ];

    return (
        <div className="bg-white rounded-xl w-[365px] h-fit p-4 flex flex-col gap-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <Image src={DummyProfileImg} alt="avatar" width={64} height={64} />
                <div className="flex flex-col gap-2">
                    <p className="font-medium">Alexander Harris</p>
                    <p className="font-medium text-sm text-gray-light">Location: Las vegas</p>
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
            <p className="text-sm text-primary font-medium underline">See more</p>
        </div>
    );
};

export default VolunteerCard;
