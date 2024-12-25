"use client";
import { volunteerData } from "@/constants/landingPage";
import ContainerHeader from "../components/ContainerHeader";
import ContainerWrapper from "../components/ContainerWrapper";
import StepsChart from "../components/StepsChart";
import LandingPageButton from "../components/Button";

interface ForVolunteerProps {
    onVolunteerLogin: (role: UserType) => void;
}

const ForVolunteer = ({ onVolunteerLogin }: ForVolunteerProps) => {
    return (
        <ContainerWrapper>
            <ContainerHeader
                title="For Volunteers"
                subTitle="You’ll find more than a volunteer role—you’ll find a purpose that uplifts"
                description="Have a passion for teach and helping others? Join our community where your efforts can make a world of difference!"
                titleColor="!text-[#FF6C00]"
            />

            <div className="flex flex-col justify-center items-center gap-1">
                <div className="flex">
                    {volunteerData.map((item, index) => (
                        <StepsChart title={item.title} icon={item.icon} index={index} />
                    ))}
                </div>
                <LandingPageButton
                    title="Become a Volunteer"
                    type="volunteer"
                    onClick={() => onVolunteerLogin("volunteer")}
                />
            </div>
        </ContainerWrapper>
    );
};

export default ForVolunteer;
