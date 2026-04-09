"use client";

import NotificationIcon from "@/assets/icons/NotificationIcon";
import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import ApprovalModal from "@/components/schedule/Modals/ApprovalModal";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useState } from "react";

const HeaderNotificationBell = () => {
    const role = Cookies.get("role");
    const volunteerId = Cookies.get("volunteer_id");
    const [isOpen, setIsOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["unread-count"],
        queryFn: async () => {
            const res: any = await GET_API(endpoints.session.getUnreadCount(volunteerId as string));
            return res?.data;
        },
        enabled: role === "volunteer" && Boolean(volunteerId),
    });

    if (role !== "volunteer") return null;

    const unreadCount = Number(data?.unread_count || 0);

    return (
        <>
            <button
                type="button"
                aria-label="Notifications"
                onClick={() => setIsOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-colors hover:bg-gray-50"
            >
                <NotificationIcon width={18} height={18} />
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 min-w-[16px] rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-4 text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            <ApprovalModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default HeaderNotificationBell;

