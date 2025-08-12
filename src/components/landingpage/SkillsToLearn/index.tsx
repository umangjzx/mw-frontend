import React from "react";
import ContainerWrapper from "../components/ContainerWrapper";
import ContainerHeader from "../components/ContainerHeader";
import SkillsToLearnCard from "@/components/common/SkillsToLearnCard";

const SkillsToLearn = () => {
    const skillsData = [
        {
            title: "📚 Academic Enrichment",
            skills: [
                "Reading",
                "Writing",
                "Storytelling",
                "Math",
                "English",
                "Physics",
                "Chemistry",
                "Biology",
                "History",
            ],
        },
        {
            title: "🎨 Creative Arts",
            skills: [
                "Drawing",
                "Painting",
                "Sculpting",
                "Origami",
                "Sewing",
                "Beading",
                "Drama",
                "Dance",
                "Photography",
                "Scrapbooking",
                "Makeup",
                "Puppet Shows",
            ],
        },
        {
            title: "🎵 Music",
            skills: [
                "Vocal Music",
                "Guitar",
                "Veena",
                "Keyboard",
                "Violin",
                "Ukulele",
                "Songs / Nursery Rhymes",
                "Drums",
            ],
        },
        {
            title: "💻 Technology and Digital Skills",
            skills: [
                "Computer Science",
                "Basic Coding",
                "Animations",
                "Scratch Programming",
                "Microsoft Excel",
                "Microsoft Word",
                "Microsoft PowerPoint",
            ],
        },
        {
            title: "🍳 Life & Functional Skills",
            skills: ["Cooking", "Baking"],
        },
        {
            title: "🧘 Wellness & Therapy",
            skills: ["Yoga", "Meditation"],
        },
        {
            title: "🧠 Cognitive & Social Development",
            skills: ["Social Skills", "Communication Skills"],
        },
        {
            title: "🧩 STEM & Hands-On Exploration",
            skills: [
                "Lego",
                "Abacus",
                "Chess",
                "Board Games",
                "Rubik's Cube",
                "Science Experiments",
            ],
        },
    ];

    return (
        <ContainerWrapper>
            <div className="flex flex-col gap-10 w-full">
                <ContainerHeader
                    title="Skills to Learn"
                    subTitle="Discover Your Potential Through Learning"
                    description="Explore a wide range of skills and subjects designed to nurture growth, creativity, and development for learners of all abilities."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillsData.map((skillCategory, index) => (
                        <SkillsToLearnCard
                            key={index}
                            title={skillCategory.title}
                            skills={skillCategory.skills}
                        />
                    ))}
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default SkillsToLearn;
