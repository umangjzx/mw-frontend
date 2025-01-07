"use client";
import { create } from "zustand";
import { useVolunteer } from "./useVolunteer";
import { useLearner } from "./useLearner";
import { useGlobalStore } from "./useGlobalStore";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const useAppStore = create<UseAppStoreProps>()(
    devtools(
        persist(
            (set, get, api) => {
                return {
                    ...useVolunteer(set, get, api),
                    ...useLearner(set, get, api),
                    ...useGlobalStore(set, get, api),
                };
            },
            {
                name: "melody-wings-store",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);
