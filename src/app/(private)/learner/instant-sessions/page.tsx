"use client";

import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import SessionCard from "@/components/learners/SessionCard";
import { InstantSessionDetailModal } from "@/components/learners/Modals";
import { useComponentStore } from "@/store/useComponenetStore";
import { InstantSessionIcon, TodayIcon } from "@/assets/icons";

// Example session data structure - replace with actual API call
interface Session {
    id: string;
    title: string;
    status: "available" | "claimed";
    tags: string[];
    description: string;
    startTime: string;
    endTime: string;
    timezone: string;
    duration: string;
    date: string; // YYYY-MM-DD format
    startDateTime?: string; // For sorting claimed sessions
    instructor: {
        name: string;
        profilePicture?: string;
    };
}


export default function InstantSessionsPage() {
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setHeaderOptions } = useComponentStore();

    // Example data - replace with actual API call
    const allSessions: Session[] = [
        {
            id: "1",
            title: "Music Class - Guitar",
            status: "available",
            tags: ["Music", "Guitar"],
            description:
                "Hey everyone! 👋 I'm diving into the world of music and wanted to share some fundamentals I've been exploring. Whether you're new to music or looking to expand your skills, this session covers the basics and beyond.",
            startTime: "12 pm",
            endTime: "1 pm",
            timezone: "PST",
            duration: "1 Hr",
            date: dayjs().format("YYYY-MM-DD"),
            startDateTime: dayjs().hour(12).minute(0).format("YYYY-MM-DD HH:mm"),
            instructor: {
                name: "Vinoth Kumar",
            },
        },
        {
            id: "2",
            title: "Music Class - Guitar",
            status: "available",
            tags: ["Music", "Guitar"],
            description:
                "Hey everyone! 👋 I'm diving into the world of music and wanted to share some fundamentals I've been exploring. Whether you're new to music or looking to expand your skills, this session covers the basics and beyond.",
            startTime: "2 pm",
            endTime: "3 pm",
            timezone: "PST",
            duration: "1 Hr",
            date: dayjs().format("YYYY-MM-DD"),
            startDateTime: dayjs().hour(14).minute(0).format("YYYY-MM-DD HH:mm"),
            instructor: {
                name: "Vinoth Kumar",
            },
        },
        {
            id: "3",
            title: "Music Class - Guitar",
            status: "available",
            tags: ["Music", "Guitar"],
            description:
                "Hey everyone! 👋 I'm diving into the world of music and wanted to share some fundamentals I've been exploring. Whether you're new to music or looking to expand your skills, this session covers the basics and beyond.",
            startTime: "4 pm",
            endTime: "5 pm",
            timezone: "PST",
            duration: "1 Hr",
            date: dayjs().format("YYYY-MM-DD"),
            startDateTime: dayjs().hour(16).minute(0).format("YYYY-MM-DD HH:mm"),
            instructor: {
                name: "Vinoth Kumar",
            },
        },
        {
            id: "4",
            title: "Music Class - Guitar",
            status: "available",
            tags: ["Music", "Guitar"],
            description:
                "Hey everyone! 👋 I'm diving into the world of music and wanted to share some fundamentals I've been exploring. Whether you're new to music or looking to expand your skills, this session covers the basics and beyond.",
            startTime: "6 pm",
            endTime: "7 pm",
            timezone: "PST",
            duration: "1 Hr",
            date: dayjs().format("YYYY-MM-DD"),
            startDateTime: dayjs().hour(18).minute(0).format("YYYY-MM-DD HH:mm"),
            instructor: {
                name: "Vinoth Kumar",
            },
        },
        {
            id: "5",
            title: "Music Class - Guitar",
            status: "claimed",
            tags: ["Music", "Guitar"],
            description:
                "Hey everyone! 👋 I'm diving into the world of music and wanted to share some fundamentals I've been exploring. Whether you're new to music or looking to expand your skills, this session covers the basics and beyond.",
            startTime: "10 am",
            endTime: "11 am",
            timezone: "PST",
            duration: "1 Hr",
            date: dayjs().format("YYYY-MM-DD"),
            startDateTime: dayjs().hour(10).minute(0).format("YYYY-MM-DD HH:mm"),
            instructor: {
                name: "Vinoth Kumar",
            },
        },
        {
            id: "6",
            title: "Music Class - Guitar",
            status: "claimed",
            tags: ["Music", "Guitar"],
            description:
                "Hey everyone! 👋 I'm diving into the world of music and wanted to share some fundamentals I've been exploring. Whether you're new to music or looking to expand your skills, this session covers the basics and beyond.",
            startTime: "3 pm",
            endTime: "4 pm",
            timezone: "PST",
            duration: "1 Hr",
            date: dayjs().format("YYYY-MM-DD"),
            startDateTime: dayjs().hour(15).minute(0).format("YYYY-MM-DD HH:mm"),
            instructor: {
                name: "Vinoth Kumar",
            },
        },
    ];

    // Filter and sort sessions
    const { availableSessions, claimedSessions } = useMemo(() => {
        const today = dayjs().format("YYYY-MM-DD");

        const available = allSessions.filter((session) => session.status === "available");
        const claimed = allSessions
            .filter((session) => session.status === "claimed" && session.date === today)
            .sort((a, b) => {
                // Sort by time in ascending order
                if (a.startDateTime && b.startDateTime) {
                    return dayjs(a.startDateTime).valueOf() - dayjs(b.startDateTime).valueOf();
                }
                return 0;
            });

        return { availableSessions: available, claimedSessions: claimed };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
    };

    const handleClaim = () => {
        // Handle claim logic here
        console.log("Claiming session:", selectedSession?.id);
    };

    useEffect(() => {
        setHeaderOptions({
            searchPlaceholder: "Search",
            leftButton: {
                buttonTitle: "Events",
                buttonIcon: <InstantSessionIcon />,
                buttonOnClick: () => {
                    console.log("Events clicked");
                },
                buttonClassName: "!text-black !border-none !font-medium !pr-5 !text-[20px]",
                showButton: true,
            },
            centerButton: {
                buttonTitle: "Today",
                buttonIcon: <TodayIcon />,
                buttonOnClick: () => {
                    console.log("Today clicked");
                },
                buttonClassName: "!text-black !border !border-gray-300 !font-medium !bg-white !w-[108px] !h-10 !rounded-full",
                showButton: true,
            },
        });
    }, [setHeaderOptions]);

    return (
        <div className="p-4 md:p-6">
            {/* <h1 className="text-2xl font-bold mb-6">Instant Sessions</h1> */}

            {/* Available Sessions Section */}
            {availableSessions.length > 0 && (
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableSessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => handleSessionClick(session)} />
                        ))}
                    </div>
                </div>
            )}

            {/* Today's Claimed Sessions Section */}
            {claimedSessions.length > 0 && (
                <>
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-[20px] font-medium text-[#121212]">Today's claimed session</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {claimedSessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => {}} />
                        ))}
                    </div>
                </>
            )}

            {/* Empty States */}
            {availableSessions.length === 0 && claimedSessions.length === 0 && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-gray-500 text-lg">No sessions available at the moment.</p>
                </div>
            )}

            {/* Session Detail Modal */}
            {selectedSession && (
                <InstantSessionDetailModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    session={selectedSession}
                    onClaim={handleClaim}
                    showNote={claimedSessions.length > 0 && availableSessions.length > 0 && selectedSession.id === availableSessions[0].id}
                />
            )}
        </div>
    );
}
