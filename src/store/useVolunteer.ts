"use client";

import { StateCreator } from "zustand";

export const useVolunteer: StateCreator<UseVolunteerProps> = (set, get) => ({
    volunteerName: "Iwin T",
    setVolunteerName: (name: string) => set({ volunteerName: name }),
});
