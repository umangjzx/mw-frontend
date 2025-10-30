"use client";

import BioHeader from "@/components/profile/Bio/BioHeader";
import Divider from "@/components/common/Divider";
import TagComponent from "@/components/common/Tag";
import { useState, useRef, useEffect } from "react";
import { ParentGuardianInformation, ProfileDetails, LearnerInformation, AdditionalInformation } from "./tabs";

const tabs = [
    { id: "profile-details", title: "Profile Details" },
    { id: "parent-guardian-information", title: "Parent/Guardian Information" },
    { id: "learner-information", title: "Personal Info" },
    { id: "additional-information", title: "Additional Information" },
]

const LearnerProfileBio = ({ data }: any) => {
    const tabContentRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    
    const learner_first_name = data?.learner_personal_info?.learner_first_name;
    const learner_last_name = data?.learner_personal_info?.learner_last_name;
    const contactDetail = data?.learner_personal_info?.learner_contact_details;
    const timezone = contactDetail?.timezone;

    const profileHeader = {
        full_name: `${learner_first_name} ${learner_last_name}`,
        profile_picture: data?.profile_picture?.image_url,
        country: contactDetail?.country,
        gender: data?.learner_personal_info?.learner_gender,
        timezone: timezone,
        profile_video: data?.profile_video,
    }

    useEffect(() => {
        if (tabContentRef.current) {
            tabContentRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile-details":
                return <ProfileDetails data={data?.learner_personal_info} />
            case "parent-guardian-information":
                return <ParentGuardianInformation data={data?.parent_info} />
            case "learner-information":
                return <LearnerInformation data={data} />
            case "additional-information":
                return <AdditionalInformation data={data?.additional_info} />
        }
    }

    return (
        <div className="bg-white rounded-3xl w-full flex flex-col gap-6 py-5 h-[83vh]">
            <BioHeader data={profileHeader} />
            <div className="flex flex-wrap gap-2 px-4">
                {
                    tabs.map((tab) => (
                        <div key={tab.id} className="cursor-pointer">
                            <TagComponent 
                            text={tab.title} 
                            className={`!text-sm py-1 px-3 border ${activeTab === tab.id ? "bg-background border-primary" : "bg-background-input text-gray-dark border-gray-dark"}`} 
                            onClick={() => setActiveTab(tab.id)} 
                            />
                        </div>
                    ))
                }
            </div>
            <Divider />
            <div className="px-5 h-full overflow-y-auto no-scrollbar">
                <div ref={tabContentRef} />
                { renderTabContent() }
            </div>
        </div>
    );
};

export default LearnerProfileBio;
