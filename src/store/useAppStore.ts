"use client";
import { create } from "zustand";
import { useVolunteer } from "./useVolunteer";
import { useLearner } from "./useLearner";
import { useGlobalStore } from "./useGlobalStore";
import { useComponentStore } from "./useComponenetStore";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const useAppStore = create<UseAppStoreProps>()(
    devtools((set, get, api) => {
        const persistedState = persist<
            Omit<UseAppStoreProps, keyof ReturnType<typeof useComponentStore>>
        >(
            (set, get, api) => ({
                ...useVolunteer(set, get, api),
                ...useLearner(set, get, api),
                ...useGlobalStore(set, get, api),
            }),
            {
                name: "melody-wings-store",
                storage: createJSONStorage(() => localStorage),
            }
        )(set, get, api);

        return {
            ...persistedState,
            ...useComponentStore(set, get, api),
        };
    })
);
