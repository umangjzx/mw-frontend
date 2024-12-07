"use client";
import Bio from "@/components/profile/Bio";
import Overview from "@/components/profile/Overview";
const Profile = () => {
    return (
        <div className="p-10 bg-slate-300 flex gap-10">
            <Bio />
            <Overview />
        </div>
    );
};

export default Profile;
