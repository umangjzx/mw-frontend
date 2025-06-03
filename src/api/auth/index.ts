import { API_URL } from "@/definitions";
import { endpoints } from "../constants";
import axios from "axios";
import { setCookie } from "@/utils/auth";

export const handleCookie = (data: any) => {
    const role = data?.role;
    const idKey = `${role}_id`;
    const cookieData = {
        [idKey]: data[idKey],
        token: data?.access_token,
        role,
        onboarded_status: data?.onboarded_status,
    };

    setCookie(cookieData);
};

export const apiGoogleSignUp = async (access_token: string, payload: any) => {
    const response = await axios(`${API_URL}/${endpoints.user.signIn}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        data: JSON.stringify(payload),
    });

    const { data, status } = response;
    if (status === 201) handleCookie(data);
    return { ...data, status };
};

export const apiGoogleLogin = async (access_token: string) => {
    const response = await axios(`${API_URL}/${endpoints.user.login}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    });

    const { data, status } = response;
    if (status === 200) handleCookie(data);
    return { ...data, status };
};
