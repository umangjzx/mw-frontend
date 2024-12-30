"use client";
import { learnerData } from "@/constants/landingPage";
import ContainerHeader from "../components/ContainerHeader";
import ContainerWrapper from "../components/ContainerWrapper";
import StepsChart from "../components/StepsChart";
import LandingPageButton from "../components/Button";

interface ForLearnerProps {
    onLearnerLogin: (role: UserType) => void;
}

const ForLearner = ({ onLearnerLogin }: ForLearnerProps) => {
    return (
        <ContainerWrapper>
            <ContainerHeader
                title="For Learners"
                subTitle="Explore new horizons in learning and foster growth"
                description="Search for a  champion your learner deserves and connect with volunteer to teach for free"
                titleColor="!text-[#009BCC]"
            />
            <div className="flex flex-col justify-center items-center gap-1">
                <div className="flex">
                    {learnerData.map((item, index) => (
                        <StepsChart key={index} title={item.title} icon={item.icon} index={index} />
                    ))}
                </div>
                <LandingPageButton
                    title="Enroll as Learner"
                    type="learner"
                    onClick={() => onLearnerLogin("learner")}
                />
            </div>
        </ContainerWrapper>
    );
};

export default ForLearner;
