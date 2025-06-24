"use client";

import { StateCreator } from "zustand";

export const useLearner: StateCreator<UseLearnerProps> = (set, get) => ({
    learnerTimeZone: "",
    setLearnerTimeZone: (timezone: string) => set({ learnerTimeZone: timezone }),
    learnerUtcOffset: "",
    setLearnerUtcOffset: (offset: string) => set({ learnerUtcOffset: offset }),
    learnerName: "",
    setLearnerName: (name: string) => set({ learnerName: name }),
    learnerImage: "",
    setLearnerImage: (image: string) => set({ learnerImage: image }),
    learnerDetails: {},
    setLearnerDetails: (data: object) => set({ learnerDetails: data }),
});
