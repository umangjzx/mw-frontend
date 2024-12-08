'use client';

import { StateCreator } from 'zustand';

export const useVolunteer: StateCreator<UseVolunteerProps> = (set, get) => ({
    headerOptions: null,
    setHeaderOptions: (options: HeaderOptions) => set({ headerOptions: options }),
});
