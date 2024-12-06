import CalendarIcon from "@/assets/icons/CalendarIcon";
import CommunityIcon from "@/assets/icons/Community";
import LearnerIcon from "@/assets/icons/LeanerIcon";
import ResourceIcon from "@/assets/icons/ResourceIcon";
import SignOutIcon from "@/assets/icons/SignOut";
import Divider from "@/components/common/Divider";
import Logo from "@/components/common/Logo";
import Avatar from "./Avatar";
import SectionCard from "./SectionCard";
const Sidebar = () => {
    const linksData = [
        {
            href: "/schedule",
            text: "Schedule",
            icon: <CalendarIcon />,
        },
        {
            href: "/learner",
            text: "Learner",
            icon: <LearnerIcon />,
        },
        {
            href: "/resource",
            text: "Resources",
            icon: <ResourceIcon />,
        },
        {
            href: "/community",
            text: "Community",
            icon: <CommunityIcon />,
        },
    ];

    return (
        <div className="bg-white h-screen flex-shrink-0 w-[240px] flex flex-col items-center justify-between py-6 px-2">
            <div>
                <Logo />
                <div className="flex flex-col items-center gap-3 w-full mt-[4rem]">
                    <Avatar />
                    <Divider />
                </div>
                <div className="flex flex-col items-center gap-[2.2rem] w-full mt-[2rem]">
                    {linksData.map((link) => (
                        <SectionCard key={link.href} {...link} />
                    ))}
                </div>
            </div>
            <SectionCard href="/" text="Sign Out" icon={<SignOutIcon />} textColor="#B91C1C" />
        </div>
    );
};

export default Sidebar;
