"use client";

import { StateCreator } from "zustand";

export const useVolunteer: StateCreator<UseVolunteerProps> = (set, get) => ({
    volunteerImage: "",
    setVolunteerName: (name: string) => set({ volunteerName: name }),
    volunteerName: "",
    setVolunteerImage: (image: string) => set({ volunteerImage: image }),
    volunteerDetails: {},
    setVolunteerDetails: (data: object) => set({ volunteerDetails: data }),
});
