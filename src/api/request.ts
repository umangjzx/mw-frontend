/** @format */
"use client";

import axios from "axios";
import { API_URL } from "@/definitions";

const BASE_URL = API_URL;
console.log("🚀 ~ file: request.ts:6 ~ BASE_URL:", BASE_URL)

const request = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "ngrok-skip-browser-warning": "any",
    },
});

const getHeaders = async () => {
    const headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "any",
    };
    return headers;
};

export const GetAPI = async (endPoint: any) => {
    return new Promise((resolve, reject) => {
            request
                .get(endPoint)
                .then(response => {
                    resolve(response);
                })
                .catch(err => reject(err))
    });
};

export const PostAPI = async (endPoint: any, payload: any) => {
    console.log("🚀 ~ file: request.ts:6 ~ BASE_URL:", endPoint)
    return new Promise((resolve, reject) => {
        request
            .post(endPoint, payload)
            .then(response => {
                resolve(response);
            })
            .catch(err => reject(err));
    });
};

export const PostFormDataAPI = async (endPoint: any, payload: any) => {
    return new Promise((resolve, reject) => {
        request
            .post(endPoint, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        .then(response => {
            resolve(response);
        })
            .catch(err => reject(err))
    });
};

export const PutAPI = async (endPoint: any, payload: any) => {
    return new Promise((resolve, reject) => {
        request
            .put(endPoint, payload)
            .then(response => {
                resolve(response);
            })
            .catch(err => reject(err));
    });
};

export const DeleteAPI = async (endPoint: any, payload?: any) => {

    return new Promise((resolve, reject) => {
        request
            .delete(endPoint)
            .then(response => {
                    resolve(response);
            })
            .catch(err => reject(err))
    });
};
