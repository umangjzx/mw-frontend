import React from "react";
import FeedCard from "@/components/community/FeedCard";
import Divider from "@/components/common/Divider";
import ActionPanel from "@/components/community/ActionPanel";
import FeedViewModal from "@/components/community/FeedViewModal";
import NotificationCard from "@/components/community/NotificationCard";
import MeetingPreviewModal from "@/components/schedule/MeetingPreviewModal";
const Community = () => {
    return (
        <div className="bg-[#f4f7fb] w-full">
            <h1>Community</h1>
            {/* <div className="flex gap-4 w-full">
                <div className="flex flex-col gap-4 2xl:w-[850px] w-[720px] bg-white rounded-xl p-5">
                    <NotificationCard />
                    <div className="flex flex-col gap-3"></div>
                    <FeedCard />
                    <Divider />
                </div> */}
            {/* <ActionPanel /> */}
            {/* <FeedViewModal /> */}
            {/* </div> */}
            <MeetingPreviewModal />
        </div>
    );
};

export default Community;
