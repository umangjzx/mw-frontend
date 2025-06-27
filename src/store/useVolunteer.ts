"use client";

import { StateCreator } from "zustand";

export const useVolunteer: StateCreator<UseVolunteerProps> = (set, get) => ({
    volunteerTimeZone: "",
    setVolunteerTimeZone: (timezone: string) => set({ volunteerTimeZone: timezone }),
    volunteerUtcOffset: "",
    setVolunteerUtcOffset: (offset: string) => set({ volunteerUtcOffset: offset }),
    volunteerImage: "",
    setVolunteerName: (name: string) => set({ volunteerName: name }),
    volunteerName: "",
    setVolunteerImage: (image: string) => set({ volunteerImage: image }),
    volunteerDetails: {},
    setVolunteerDetails: (data: object) => set({ volunteerDetails: data }),
});
