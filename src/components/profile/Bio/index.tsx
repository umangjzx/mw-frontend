"use client";
import DetailCard from "./DetailCard";
import TagComponent from "@/components/common/Tag";
import BioHeader from "@/components/profile/Bio/BioHeader";
import Divider from "@/components/common/Divider";
import DetailChipCard from "@/components/profile/Bio/DetailChipCard";

const index = () => {
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

    return (
        <div className="bg-white rounded-3xl w-[465px] flex flex-col gap-6 py-5">
            <BioHeader />
            <Divider />
            <div className="px-5 flex flex-col gap-3">
                <p className="font-medium text-xl">Bio</p>
                <p className="text-sm text-gray-light font-normal">
                    Passionate educator with over 5 years of experience working with children of all
                    abilities. I specialize in personalized learning plans, with a focus on music
                    therapy and language development, aimed at fostering creativity and confidence.
                </p>
            </div>
            <div className="px-5 flex items-center justify-between gap-3">
                <p className="font-medium ">Location</p>
                <TagComponent text="New York, NY" className="text-xs py-1 font-medium px-2" />
            </div>
            {details.map((detail) => (
                <DetailChipCard tags={detail.tags} title={detail.title} />
            ))}
            {bio.map((item) => (
                <DetailCard title={item.title} description={item.description} />
            ))}
        </div>
    );
};

export default index;
