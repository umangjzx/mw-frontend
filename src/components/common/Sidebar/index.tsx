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
    VolunteerIcon,
} from "@/assets/icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
    const role = Cookies.get("role");
    const router = useRouter();

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
                  text: "Seek Volunteer",
                  icon: <VolunteerIcon />,
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
    const linksData = [...baseLinksData, roleBasedLink];

    const handleSignOut = () => {
        const cookieSetting = { path: "/", secure: true };
        Cookies.remove("role", cookieSetting);
        Cookies.remove("token", cookieSetting);
        Cookies.remove("refresh_token", cookieSetting);
        Cookies.remove("learner_id", cookieSetting);
        Cookies.remove("volunteer_id", cookieSetting);
        Cookies.remove("onboarded_status", cookieSetting);

        if (typeof window !== "undefined") {
            localStorage.clear();
        }
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    };

    return (
        <div className="bg-white w-full h-screen flex flex-col items-center justify-between p-6">
            <div>
                <Link href="/">
                    <Logo />
                </Link>
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
            <button onClick={handleSignOut} className="flex gap-1">
                <span className={`text-[1.25rem] transition-all duration-300 "text-black"`}>
                    <SignOutIcon />
                </span>
                <p
                    style={{ color: "#B91C1C" }}
                    className={`!text-[#B91C1C] transition-all duration-300 font-medium`}
                >
                    Sign Out
                </p>
            </button>
        </div>
    );
};

export default Sidebar;
