"use client";

import BioHeader from "@/components/profile/Bio/BioHeader";
import Divider from "@/components/common/Divider";
import TagComponent from "@/components/common/Tag";
import { useState, useRef, useEffect } from "react";
import { ProfileDetails, VolunteerContactDetails } from "./tabs";

const tabs = [
    { id: "profile-details", title: "Profile Details" },
    { id: "contact-details", title: "Contact Details" },
];

const VolunteerProfileBio = ({ data }: any) => {
    const tabContentRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const volunteer_first_name = data?.volunteer_first_name;
    const volunteer_last_name = data?.volunteer_last_name;
    const contactDetail = data?.volunteer_contact_details;
    const timezone = contactDetail?.timezone;

    const profileHeader = {
        full_name: `${volunteer_first_name} ${volunteer_last_name}`,
        profile_picture: data?.profile_picture?.image_url,
        country: contactDetail?.country,
        gender: data?.volunteer_gender,
        timezone: contactDetail?.timezone,
        profile_video: data?.profile_video,
    };

    useEffect(() => {
        if (tabContentRef.current) {
            tabContentRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile-details":
                return <ProfileDetails data={data} />;
            case "contact-details":
                return <VolunteerContactDetails data={data?.volunteer_contact_details} />;
        }
    };

    return (
        <div className="bg-white rounded-3xl w-full flex flex-col gap-6 py-5 h-[83vh] ">
            <BioHeader data={profileHeader} />
            <div className="flex flex-wrap gap-2 px-4">
                {tabs.map((tab) => (
                    <div key={tab.id} className="cursor-pointer">
                        <TagComponent
                            text={tab.title}
                            className={`!text-sm py-1 px-3 border ${
                                activeTab === tab.id
                                    ? "bg-background border-primary"
                                    : "bg-background-input text-gray-dark border-gray-dark"
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    </div>
                ))}
            </div>
            <Divider />
            <div className="px-5 h-full overflow-y-auto no-scrollbar">
                <div ref={tabContentRef} />
                {renderTabContent()}
            </div>
        </div>
    );
};

export default VolunteerProfileBio;
