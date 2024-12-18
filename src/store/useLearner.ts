"use client";

import { StateCreator } from "zustand";

export const useLearner: StateCreator<UseLearnerProps> = (set, get) => ({
    learnerImage: "",
    learnerName: "Rithik",
    setLearnerName: (name: string) => set({ learnerName: name }),
    setLearnerImage: (image: string) => set({ learnerImage: image }),
});
