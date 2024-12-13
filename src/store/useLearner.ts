"use client";

import { StateCreator } from "zustand";

export const useLearner: StateCreator<UseLearnerProps> = (set, get) => ({
    learnerName: "Rithik",
    setLearnerName: (name: string) => set({ learnerName: name }),
});
