"use client";

import { UserType } from "@/interfaces/user";
import { getLocalStorage } from "./localStorage";

export const VolunteerTheme = {
    primary: "#FE5B11",
    background: "#FFE9D4",
    backgroundSecondary: "#FFAC71",
};

export const LearnerTheme = {
    primary: "#09BAEE",
    background: "#DFF5FF",
    backgroundSecondary: "#68DBFF",
};

export const getTheme = () => {
    if (typeof window === "undefined") return LearnerTheme;

    const userType = getLocalStorage("role");

    switch (userType) {
        case UserType.VOLUNTEER:
            return VolunteerTheme;
        case UserType.LEARNER:
            return LearnerTheme;
        default:
            return LearnerTheme;
    }
};
