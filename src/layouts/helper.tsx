import {
    CommunityIcon,
    LearnerIcon,
    ResourceIcon,
    VolunteerIcon,
    MessageIcon,
    SettingIcon,
} from "@/assets/icons";
import CommonHeader from "@/components/common/Header";
import { CalenderHeader } from "@/components/schedule";
import { IoIosArrowBack } from "react-icons/io";

export const getHeaderTitle = (pathname: string) => {
    const path = pathname.split("/")?.[2];
    return path;
};

//TODO: Need Redandunt work here
export const getHeaderIcon = (pathname: string) => {
    if (pathname === "backIcon") return <IoIosArrowBack />;
    switch (getHeaderTitle(pathname)) {
        case "learners":
            return <LearnerIcon />;
        case "resources":
            return <ResourceIcon />;
        case "community":
            return <CommunityIcon />;
        case "volunteer":
            return <VolunteerIcon />;
        case "messages":
            return <MessageIcon />;
        case "settings":
            return <SettingIcon />;
        default:
            return null;
    }
};

//TODO: Need Redandunt work here
export const renderHeader = (pathname: string) => {
    switch (getHeaderTitle(pathname)) {
        case "schedule":
            return <CalenderHeader />;
        default:
            return <CommonHeader />;
    }
};
