"use client";

import NotificationIcon from "@/assets/icons/NotificationIcon";
import { endpoints } from "@/api/constants";
import { GET_API } from "@/api/request";
import ApprovalModal from "@/components/schedule/Modals/ApprovalModal";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useState } from "react";
import { usePathname } from "next/navigation";

const HeaderNotificationBell = () => {
    const pathname = usePathname();
    const role = Cookies.get("role");
    const volunteerId = Cookies.get("volunteer_id");
    const [isOpen, setIsOpen] = useState(false);
    const isResourcesPage = pathname?.includes("/resources");

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
                className={`relative inline-flex items-center justify-center rounded-full border-0 bg-white text-black transition-colors hover:bg-gray-50 md:border md:border-gray-200 ${
                    isResourcesPage ? "h-6 w-6 md:h-10 md:w-10" : "h-10 w-10"
                }`}
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

