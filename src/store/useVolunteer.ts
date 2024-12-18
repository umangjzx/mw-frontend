"use client";

import { StateCreator } from "zustand";

export const useVolunteer: StateCreator<UseVolunteerProps> = (set, get) => ({
    volunteerImage: "",
    volunteerName: "Iwin T",
    setVolunteerName: (name: string) => set({ volunteerName: name }),
    setVolunteerImage: (image: string) => set({ volunteerImage: image }),
});
