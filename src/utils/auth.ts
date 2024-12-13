import Cookies from "js-cookie";

export const isAuthenticated = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    return token && role && (role === "learner" || role === "volunteer");
};
