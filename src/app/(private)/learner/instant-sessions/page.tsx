"use client";

import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import moment from "moment";
import SessionCard from "@/components/learners/SessionCard";
import { InstantSessionDetailModal } from "@/components/learners/Modals";
import ConfirmationSuccessfulModal from "@/components/learners/Modals/ConfirmationSuccessfulModal";
import { useComponentStore } from "@/store/useComponenetStore";
import { InstantSessionIcon, TodayIcon } from "@/assets/icons";
import { GET_API, DELETE_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/components/common/Toast";
import LottieLoader from "@/components/common/Loader/Lottie";

export interface Session {
    id: string;
    title: string;
    status: "available" | "claimed";
    tags: string[];
    description: string;
    startTime: string;
    endTime: string;
    timezone: string;
    duration: string;
    date: string;
    startDateTime?: string;
    /** For claim API: volunteer_id, start_time and end_time in 24h (HH:mm) */
    volunteer_id?: string;
    start_time_24?: string;
    end_time_24?: string;
    instructor: {
        name: string;
        profilePicture?: string;
    };
}

/** Map API response item to Session (handles common field names) */
function mapItemToSession(item: any, date: string): Session {
    const id = item.session_id ?? item.volunteer_slot_id ?? item.id ?? "";
    const title = item.title ?? item.session_title ?? "Session";
    const desc = item.description ?? item.session_description ?? "";
    const startTimeRaw = item.start_time ?? item.learner_start_time ?? item.startTime ?? "00:00";
    const endTimeRaw = item.end_time ?? item.learner_end_time ?? item.endTime ?? "00:00";
    const startTime = formatTime12h(startTimeRaw);
    const endTime = formatTime12h(endTimeRaw);
    const duration = item.duration ?? formatDuration(startTimeRaw, endTimeRaw);
    const timezone =
        item.volunteer_timezone?.split(" - ")[0] ?? item.learner_timezone?.split(" - ")[0] ?? "";
    const instructorName =
        item.volunteer_full_name ?? item.instructor?.name ?? item.volunteer_name ?? "Instructor";
    const rawTags = Array.isArray(item.tags)
        ? item.tags
        : Array.isArray(item.skills)
        ? item.skills
        : item.skill
        ? [item.skill]
        : [];
    const tags: string[] = rawTags
        .map((t: any) =>
            typeof t === "string"
                ? t
                : t?.skill_name ?? t?.name ?? (t?.skill_id != null ? String(t.skill_id) : "")
        )
        .filter(Boolean);
    const isClaimed =
        item.is_accepted === true || item.status === "claimed" || item.status === "accepted";
    const startDateTime =
        item.learner_start_date && item.learner_start_time
            ? `${item.learner_start_date} ${item.learner_start_time}`
            : `${date} ${startTimeRaw}`;

    return {
        id,
        title,
        status: isClaimed ? "claimed" : "available",
        tags,
        description: desc,
        startTime,
        endTime,
        timezone,
        duration,
        date,
        startDateTime,
        volunteer_id: item.volunteer_id,
        start_time_24: item.start_time ?? startTimeRaw,
        end_time_24: item.end_time ?? endTimeRaw,
        instructor: {
            name: instructorName,
            profilePicture:
                item.volunteer_image?.image_url ??
                item.volunteer_picture ??
                item.instructor?.profilePicture,
        },
    };
}

function formatTime12h(time: string): string {
    if (!time) return "12:00 am";
    const [h = 0, m = 0] = String(time).split(":").map(Number);
    const period = h >= 12 ? "pm" : "am";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDuration(start: string, end: string): string {
    const [sh, sm] = String(start).split(":").map(Number);
    const [eh, em] = String(end).split(":").map(Number);
    const mins = (eh - sh) * 60 + (em - sm);
    if (mins >= 60) return `${Math.floor(mins / 60)} Hr`;
    return `${mins} mins`;
}

export default function InstantSessionsPage() {
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClaimedSession, setSelectedClaimedSession] = useState<Session | null>(null);
    const [isClaimedModalOpen, setIsClaimedModalOpen] = useState(false);
    const [claimedSessionDetails, setClaimedSessionDetails] = useState<any>(null);
    const [isLoadingClaimedDetails, setIsLoadingClaimedDetails] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const queryClient = useQueryClient();
    const { setHeaderOptions } = useComponentStore();

    const today = dayjs().format("YYYY-MM-DD");

    // Query for available sessions
    const {
        data: apiData,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["learner-instant-sessions", today],
        queryFn: async () => {
            const res = await GET_API(endpoints.session.getLearnerInstantSession(today));
            return res?.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Query for accepted/claimed sessions using the new API endpoint
    const {
        data: claimedApiData,
        isLoading: isClaimedLoading,
        isFetching: isClaimedFetching,
        isError: isClaimedError,
    } = useQuery({
        queryKey: ["learner-accepted-instant-sessions", today],
        queryFn: async () => {
            const res = await GET_API(endpoints.session.getAcceptedInstantSessionsByDate(today));
            return res?.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const availableSessions: Session[] = useMemo(() => {
        if (!apiData) return [];
        const raw = Array.isArray(apiData) ? apiData : apiData.items ?? apiData.sessions ?? [];
        return raw
            .map((item: any) => mapItemToSession(item, today))
            .filter((s: Session) => s.status === "available");
    }, [apiData, today]);

    const claimedSessions: Session[] = useMemo(() => {
        if (!claimedApiData) return [];
        const raw = Array.isArray(claimedApiData)
            ? claimedApiData
            : claimedApiData.items ?? claimedApiData.sessions ?? [];
        return raw
            .map((item: any) => mapItemToSession(item, today))
            .filter((s: Session) => s.date === today)
            .sort((a: Session, b: Session) =>
                a.startDateTime && b.startDateTime
                    ? dayjs(a.startDateTime).valueOf() - dayjs(b.startDateTime).valueOf()
                    : 0
            );
    }, [claimedApiData, today]);

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
    };

    const handleClaim = () => {
        console.log("Claiming session:", selectedSession?.id);
    };

    const handleClaimedSessionClick = async (session: Session) => {
        setSelectedClaimedSession(session);
        setIsLoadingClaimedDetails(true);
        setIsClaimedModalOpen(true);

        try {
            const response = await GET_API(
                endpoints.session.getLearnerInstantSessionDetail(session.id)
            );
            const apiData = response.data;

            if (apiData) {
                const formattedSession = {
                    id: apiData.volunteer_slot_id ?? session.id,
                    title: apiData.title ?? session.title,
                    startTime: apiData.start_time
                        ? moment(apiData.start_time, "HH:mm").format("h:mm a")
                        : session.startTime,
                    endTime: apiData.end_time
                        ? moment(apiData.end_time, "HH:mm").format("h:mm a")
                        : session.endTime,
                    timezone:
                        (apiData.volunteer_timezone || session.timezone)?.split(" - ")[0] ??
                        session.timezone,
                    duration: apiData.duration ? `${apiData.duration} Mins` : session.duration,
                    instructor: {
                        name: apiData.volunteer_name ?? session.instructor.name,
                        profilePicture:
                            apiData.volunteer_image?.image_url ?? session.instructor.profilePicture,
                    },
                    meetingLink: apiData.meet_link,
                    guests:
                        apiData.volunteer_email && apiData.learner_email
                            ? [apiData.volunteer_email, apiData.learner_email]
                            : [],
                    is_learner: apiData.is_learner ?? false,
                };
                setClaimedSessionDetails(formattedSession);
            } else {
                // Fallback to basic session data
                setClaimedSessionDetails({
                    ...session,
                    meetingLink: undefined,
                    guests: [],
                    is_learner: false,
                });
            }
        } catch (error) {
            console.error("Failed to fetch session details:", error);
            // Fallback to basic session data
            setClaimedSessionDetails({
                ...session,
                meetingLink: undefined,
                guests: [],
                is_learner: false,
            });
        } finally {
            setIsLoadingClaimedDetails(false);
        }
    };

    const handleCloseClaimedModal = () => {
        setIsClaimedModalOpen(false);
        setSelectedClaimedSession(null);
        setClaimedSessionDetails(null);
    };

    const handleCancelMeeting = async () => {
        if (!claimedSessionDetails?.id) return;

        setIsActionLoading(true);
        try {
            const res = await DELETE_API(
                endpoints.session.unclaimInstantSession(claimedSessionDetails.id)
            );
            if (res.status === 200 || res.status === 201) {
                showToast({ message: "Session unclaimed successfully", type: "success" });
                
                // Invalidate and refetch queries to update the UI immediately
                // This ensures the cancelled session appears in available sessions
                await queryClient.invalidateQueries({ queryKey: ["learner-instant-sessions"] });
                await queryClient.invalidateQueries({ queryKey: ["learner-accepted-instant-sessions"] });
                
                // Refetch to ensure fresh data
                await queryClient.refetchQueries({ queryKey: ["learner-instant-sessions", today] });
                await queryClient.refetchQueries({ queryKey: ["learner-accepted-instant-sessions", today] });
                
                handleCloseClaimedModal();
            } else {
                showToast({ message: "Failed to unclaim session", type: "error" });
            }
        } catch (error) {
            console.error("Error unclaiming session:", error);
            showToast({ message: "Failed to unclaim session", type: "error" });
        } finally {
            setIsActionLoading(false);
        }
    };

    useEffect(() => {
        setHeaderOptions({
            searchPlaceholder: "Search",
            leftButton: {
                buttonTitle: "Events",
                buttonIcon: <InstantSessionIcon />,
                buttonOnClick: () => {},
                buttonClassName: "!text-black !border-none !font-medium !pr-5 !text-[20px]",
                showButton: true,
            },
            centerButton: {
                buttonTitle: "Today",
                buttonIcon: <TodayIcon />,
                buttonOnClick: () => {},
                buttonClassName:
                    "!text-black !border !border-gray-300 !font-medium !bg-white !w-[108px] !h-10 !rounded-full",
                showButton: true,
            },
        });
    }, [setHeaderOptions]);

    // Show loader when loading initially or fetching (when switching to page)
    const isPageLoading = isLoading || isClaimedLoading || isFetching || isClaimedFetching;

    if (isError || isClaimedError) {
        return (
            <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500 text-lg">Failed to load sessions. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="relative p-4 md:p-6 min-h-full">
            {isPageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background-input">
                    <LottieLoader isLoading={true} />
                </div>
            )}
            {availableSessions.length > 0 && (
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableSessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onClick={() => handleSessionClick(session)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {claimedSessions.length > 0 && (
                <>
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-200" />
                        <span className="px-4    md:text-[20px] text-[16px] font-medium text-[#121212]">
                            Today&apos;s claimed session
                        </span>
                        <div className="flex-1 border-t border-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {claimedSessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                onClick={() => handleClaimedSessionClick(session)}
                            />
                        ))}
                    </div>
                </>
            )}

            {availableSessions.length === 0 && claimedSessions.length === 0 && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-gray-500 text-lg">No sessions available at the moment.</p>
                </div>
            )}

            {selectedSession && (
                <InstantSessionDetailModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    session={selectedSession}
                    onClaim={handleClaim}
                    onClaimLoadingChange={setIsActionLoading}
                    showNote={
                        claimedSessions.length > 0 &&
                        availableSessions.length > 0 &&
                        selectedSession.id === availableSessions[0]?.id
                    }
                />
            )}

            {/* Loader when claiming or unclaiming (card switching) - only covers content area */}
            {isActionLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background-input">
                    <LottieLoader isLoading={true} />
                </div>
            )}

            {/* Confirmation Modal for Claimed Sessions */}
            {/* {isClaimedModalOpen && claimedSessionDetails && !isLoadingClaimedDetails && (
                <ConfirmationSuccessfulModal
                    isOpen={isClaimedModalOpen}
                    onClose={handleCloseClaimedModal}
                    session={claimedSessionDetails}
                    onCancelMeeting={handleCancelMeeting}
                />
            )} */}
        </div>
    );
}
