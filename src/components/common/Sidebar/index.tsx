import Divider from "@/components/common/Divider";
import Logo from "@/components/common/Logo";
import Avatar from "./Avatar";
import SectionCard from "./SectionCard";
import {
    CalendarIcon,
    CommunityIcon,
    LearnerIcon,
    ResourceIcon,
    SignOutIcon,
} from "@/assets/icons";

const Sidebar = () => {
    const role = localStorage.getItem("role");

    const baseLinksData = [
        {
            href: "/schedule",
            text: "Schedule",
            icon: <CalendarIcon />,
        },
    ];

    // Insert either learner or volunteer link at position 2 based on role
    const roleBasedLink =
        role === "volunteer"
            ? {
                  href: "/learners",
                  text: "Learners",
                  icon: <LearnerIcon />,
              }
            : {
                  href: "/volunteer",
                  text: "Volunteer",
                  icon: <LearnerIcon />,
              };

    const remainingLinks = [
        {
            href: "/resources",
            text: "Resources",
            icon: <ResourceIcon />,
        },
        {
            href: "/community",
            text: "Community",
            icon: <CommunityIcon />,
        },
    ];

    // Combine all links in the desired order
    const linksData = [...baseLinksData, roleBasedLink, ...remainingLinks];

    return (
        <div className="bg-white w-full h-screen flex flex-col items-center justify-between p-6">
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
