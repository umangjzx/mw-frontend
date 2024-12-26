"use client";

import { StateCreator } from "zustand";

export const useLearner: StateCreator<UseLearnerProps> = (set, get) => ({
    learnerName: "Rithik",
    setLearnerName: (name: string) => set({ learnerName: name }),
    learnerImage: "",
    setLearnerImage: (image: string) => set({ learnerImage: image }),
    learnerDetails: {},
    setLearnerDetails: (data: object) => set({ learnerDetails: data }),
});
