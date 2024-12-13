"use client";

import { StateCreator } from "zustand";

export const useGlobalStore: StateCreator<UseGlobalStoreProps> = (set, get) => ({
    currentMonth: "",
    eventDetails: {
        volunteer_id: "",
        session_id: "",
        learner_id: "",
    },
    setCurrentMonth: (date: string) => set({ currentMonth: date }),
    setEventDetails: (details: any) => {
        const eventDetails = details?._def?.extendedProps;
        set({
            eventDetails: {
                volunteer_id: eventDetails?.volunteerId,
                session_id: eventDetails?.sessionId,
                learner_id: eventDetails?.learner?.id,
            },
        });
    },
});
