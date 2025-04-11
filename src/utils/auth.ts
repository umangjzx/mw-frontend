import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie";

export const isAuthenticated = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const onboarded_status = Cookies.get("onboarded_status");
    const learner_id = Cookies.get("learner_id");
    const volunteer_id = Cookies.get("volunteer_id");

    return token && onboarded_status && (role === "learner" || role === "volunteer") && (role === "learner" ? learner_id : volunteer_id);
};

export const isCookiesFound = (cookies: any) => {
    const token = cookies.get("token")?.value;
    const role = cookies.get("role")?.value;
    const onboarded_status = cookies.get("onboarded_status")?.value;
    const learner_id = cookies.get("learner_id")?.value;
    const volunteer_id = cookies.get("volunteer_id")?.value;

    const cookiesFound = token && role && onboarded_status && (role === "learner" ? learner_id : volunteer_id);
    return Boolean(cookiesFound);
};

export const isTokenValid = (cookies: any) => {
    const token = cookies.get("token")?.value;
    try {
        if (!token) return false;
        const decodedToken: any = jwtDecode(token);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) return false;

        return true;
    } catch {
        return false;
    }
};

export const getCookie = (key: string) => {
    return key && Cookies.get(key);
}

export const setCookie = (cookieData: Object) => {
    Object.entries(cookieData).forEach(([key, value]) => {
        if (value) Cookies.set(key, value, { expires: 1 })
    });
}

export const removeCookie = (key: string) => {
    Cookies.remove(key, { path: "/" });
}

export const clearCookies = () => {
    const cookies = ["token", "role", "onboarded_status", "learner_id", "volunteer_id", "cookieConsent", "lastActivity"];
    cookies.map(cookie => removeCookie(cookie));

    if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
    }
}