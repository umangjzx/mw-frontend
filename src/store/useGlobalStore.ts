"use client";

import { StateCreator } from "zustand";

export const useGlobalStore: StateCreator<UseGlobalStoreProps> = (set, get) => ({
    currentMonth: "",
    eventDetails: {
        volunteer_id: "",
        session_id: "",
        learner_id: "",
        volunteer_name: "",
        learner_name: "",
    },
    imageId: null,
    videoId: null,
    documentId: null,
    setCurrentMonth: (date: string) => set({ currentMonth: date }),
    setEventDetails: (details: any) => {
        const eventDetails = details?._def?.extendedProps;
        set({
            eventDetails: {
                volunteer_id: eventDetails?.volunteerId,
                session_id: eventDetails?.sessionId,
                learner_id: eventDetails?.learner?.id,
                volunteer_name: `${eventDetails?.volunteer?.firstName} ${eventDetails?.volunteer?.lastName}`,
                learner_name: `${eventDetails?.learner?.firstName} ${eventDetails?.learner?.lastName}`,
            },
        });
    },
    setImageId: (id: string | null) => set({ imageId: id }),
    setVideoId: (id: string | null) => set({ videoId: id }),
    setDocumentId: (id: string | null) => set({ documentId: id }),
});
