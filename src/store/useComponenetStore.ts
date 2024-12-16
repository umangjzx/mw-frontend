"use client";

import { StateCreator } from "zustand";

export const useComponentStore: StateCreator<UseComponentStoreProps> = (set, get) => ({
    headerOptions: null,
    setHeaderOptions: (options: HeaderOptions) => set({ headerOptions: options }),
});
