"use client";
import { create } from "zustand";
import { useVolunteer } from "./useVolunteer";

export const useAppStore = create<UseAppStoreProps>()((set, get, api) => {
    return {
        ...useVolunteer(set, get, api), //* Add stores which are needed
    };
});
