"use client";
import { learnerData } from "@/constants/landingPage";
import ContainerHeader from "../components/ContainerHeader";
import ContainerWrapper from "../components/ContainerWrapper";
import StepsChart from "../components/StepsChart";

const ForLearner = () => {
    return (
        <ContainerWrapper>
            <ContainerHeader
                title="For Learners"
                subTitle="Explore new horizons in learning and foster growth"
                description="Search for a  champion your learner deserves and connect with volunteer to teach for free"
                titleColor="!text-[#009BCC]"
            />
            <div className="flex">
                {learnerData.map((item, index) => (
                    <StepsChart title={item.title} icon={item.icon} index={index} />
                ))}
            </div>
        </ContainerWrapper>
    );
};

export default ForLearner;
