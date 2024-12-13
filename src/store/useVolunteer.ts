"use client";

import { StateCreator } from "zustand";

export const useVolunteer: StateCreator<UseVolunteerProps> = (set, get) => ({
    headerOptions: null,
    volunteerName: "Iwin T",
    setHeaderOptions: (options: HeaderOptions) => set({ headerOptions: options }),
    setVolunteerName: (name: string) => set({ volunteerName: name }),
});
