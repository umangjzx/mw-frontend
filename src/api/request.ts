/** @format */
import axios from "axios";
import { API_URL } from "@/definitions";
import { trackPromise } from "react-promise-tracker";

const BASE_URL = API_URL;

const getHeaders = async () => {
  const TOKEN = await localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "any",
    Authorization: `Bearer ${TOKEN}`,
  };
  return headers;
};

export const GetAPI = async (endPoint: any) => {
  const headers = await getHeaders();
  return new Promise((resolve, reject) => {
    trackPromise(
      axios
        .get(`${BASE_URL}/${endPoint}`, {
          headers: headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err))
    );
  });
};

export const PostAPI = async (endPoint: any, payload: any) => {
  const headers = await getHeaders();

  return new Promise((resolve, reject) => {
    trackPromise(
      axios
        .post(`${BASE_URL}/${endPoint}`, payload, { headers: headers })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err))
    );
  });
};

export const PostFormDataAPI = async (endPoint: any, payload: any) => {
  const headers = await getHeaders();

  return new Promise((resolve, reject) => {
    trackPromise(
      axios
        .post(`${BASE_URL}/${endPoint}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "any",
            Authorization: headers.Authorization,
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err))
    );
  });
};

export const PutAPI = async (endPoint: any, payload: any) => {
  const headers = await getHeaders();
  return new Promise((resolve, reject) => {
    axios
      .put(`${BASE_URL}/${endPoint}`, payload, { headers: headers })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => reject(err));
  });
};

export const DeleteAPI = async (endPoint: any, payload?: any) => {
  const headers = await getHeaders();

  return new Promise((resolve, reject) => {
    trackPromise(
      axios
        .delete(`${BASE_URL}/${endPoint}`, { headers: headers })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err))
    );
  });
};
