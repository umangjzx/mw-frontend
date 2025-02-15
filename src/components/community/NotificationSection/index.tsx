import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getNotifications, markNotificationsAsRead } from "@/api/community";
import NotificationProfileImg from "@/assets/images/NotificationProfileImg.png";
import PostImg from "@/assets/images/PostImg.png";
import Loader from "@/components/common/Loader";
import { Spin } from "antd";
import ErrorImage from "@/assets/images/SomethingWentWrong.gif";

interface Notification {
    notification_id: string;
    author_id: string;
    notification_type: string;
    read: boolean;
    user_id: string;
    created_by: string;
    post_id: string;
    // Add any additional fields from API response
}

interface NotificationPage {
    items: Notification[];
    total: number;
    page: number;
    size: number;
}

const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
    const getNotificationMessage = (type: string, createdBy: string) => {
        switch (type) {
            case "like":
                return `${createdBy} liked your post`;
            case "comment":
                return `${createdBy} commented on your post`;
            default:
                return `${createdBy} interacted with your post`;
        }
    };

    return (
        <div
            className={`flex gap-2 sm:gap-3 items-start sm:items-center justify-between p-2 pt-4 ${
                notification.read ? "opacity-50" : ""
            }`}
        >
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1">
                <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] relative flex-shrink-0">
                    <Image
                        src={NotificationProfileImg}
                        alt="Profile"
                        fill
                        className="rounded-full"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <p className="text-gray-light font-medium text-sm sm:text-base">
                        {getNotificationMessage(
                            notification.notification_type,
                            notification.created_by
                        )}
                    </p>
                </div>
            </div>
            {/* Optional: Add post preview image if available */}
            <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] relative flex-shrink-0">
                <Image src={PostImg} alt="Post preview" fill className="rounded-md" />
            </div>
        </div>
    );
};

const NotificationSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [visibleIds, setVisibleIds] = useState<string[]>([]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
        useInfiniteQuery<NotificationPage>({
            queryKey: ["notifications"],
            queryFn: ({ pageParam = 1 }) =>
                getNotifications({ page: pageParam as number, limit: 20 }),
            getNextPageParam: (lastPage) => {
                const nextPage = lastPage.page + 1;
                const totalPages = Math.ceil(lastPage.total / lastPage.size);
                return nextPage <= totalPages ? nextPage : undefined;
            },
            initialPageParam: 1,
        });

    const markAsReadMutation = useMutation({
        mutationFn: (notificationIds: string[]) => markNotificationsAsRead(notificationIds),
    });

    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }

        const visibleItems = document.querySelectorAll<HTMLDivElement>(".notification-item");
        const newVisibleIds: string[] = [];
        visibleItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                const id = item.getAttribute("data-id");
                if (id) newVisibleIds.push(id);
            }
        });

        if (
            newVisibleIds.length > 0 &&
            JSON.stringify(newVisibleIds) !== JSON.stringify(visibleIds)
        ) {
            setVisibleIds(newVisibleIds);
            markAsReadMutation.mutate(newVisibleIds);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [visibleIds, hasNextPage, isFetchingNextPage]);

    // if (isError) return (
    //         <div className="flex-center min-h-[50vh] w-full h-full max-h-[80vh]">
    //             <Image
    //                 src={ErrorImage}
    //                 alt="error"
    //                 className="w-full h-full object-cover max-w-[600px]"
    //             />
    //         </div>
    //     );

    if (data?.pages.length === 0) {
        return <div className="flex-center min-h-[50vh] w-full h-full">No Notifications</div>;
    }

    return (
        <div ref={containerRef} className="h-full overflow-y-auto p-4 md:p-0">
            <h2 className="text-xl font-medium max-md:hidden">Notifications</h2>
            {true ? (
                <NotificationSkeleton />
            ) : (
                data?.pages.map((page, i) => (
                    <React.Fragment key={i}>
                        {page.items.map((notification) => (
                            <div
                                key={notification.notification_id}
                                data-id={notification.notification_id}
                                className="notification-item"
                            >
                                <NotificationCard notification={notification} />
                            </div>
                        ))}
                    </React.Fragment>
                ))
            )}
            {isFetchingNextPage && (
                <div className="flex-center p-4">
                    <Spin className="custom-ant-spin" />
                </div>
            )}
        </div>
    );
};

// Add NotificationSkeleton component
const NotificationSkeleton = ({ size = 5 }: { size?: number }) => {
    return (
        <div className="p-4 space-y-4">
            {[...Array(size)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-2 bg-gray-200 rounded-full w-2" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-11 w-11 bg-gray-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationSection;
