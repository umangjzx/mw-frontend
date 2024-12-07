"use client";
import Bio from "@/components/profile/Bio";
import Overview from "@/components/profile/Overview";
import VolunteerCard from "@/components/leaner/VolunteerCard";
import VolunteerViewModal from "@/components/leaner/VolunteerViewModal";
const Profile = () => {
    return (
        <div className="p-10 bg-slate-300 flex gap-10">
            {/* <Bio /> */}
            {/* <Overview /> */}

            {/* <VolunteerCard /> */}
            <VolunteerViewModal />
        </div>
    );
};

export default Profile;
