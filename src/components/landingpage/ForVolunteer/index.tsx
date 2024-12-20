"use client";
import { volunteerData } from "@/constants/landingPage";
import ContainerHeader from "../components/ContainerHeader";
import ContainerWrapper from "../components/ContainerWrapper";
import StepsChart from "../components/StepsChart";

const ForVolunteer = () => {
    return (
        <ContainerWrapper>
            <ContainerHeader
                title="For Volunteers"
                subTitle="You’ll find more than a volunteer role—you’ll find a purpose that uplifts"
                description="Have a passion for teach and helping others? Join our community where your efforts can make a world of difference!"
                titleColor="!text-[#FF6C00]"
            />
            <div className="flex">
                {volunteerData.map((item, index) => (
                    <StepsChart title={item.title} icon={item.icon} index={index} />
                ))}
            </div>
        </ContainerWrapper>
    );
};

export default ForVolunteer;
