import React from "react";

interface SkillsToLearnCardProps {
    title: string;
    skills: string[];
}

const SkillsToLearnCard: React.FC<SkillsToLearnCardProps> = ({ title, skills }) => {
    return (
        <div className="bg-white lg:bg-[#f4f7fb] shadow-inner rounded-3xl p-[40px] w-full flex flex-col gap-5">
            <div>
                <p className="font-semibold text-[18px] md:text-[24px] font-poppins text-[#121212] leading-normal">{title}</p>
            </div>
            <div className="flex flex-wrap  gap-3">
                {skills.map((skill, index) => (
                    <p
                        key={index}
                        className="py-[10px] px-[16px] border-[1px] border-[#E0E0E0] bg-[#FFFFFF] rounded-[12px] w-fit text-[14px] font-medium text-[#121212]"
                    >
                        {skill}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default SkillsToLearnCard;
