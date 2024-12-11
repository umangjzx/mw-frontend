import { API_URL } from '@/definitions';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';



const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const request = async (options: AxiosRequestConfig) => {


    const token = await Cookies.get('access_token');

    //* check if the token is null or not
    if (token) {
        //* if not null - set Bearer token
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    //* Change accept header based on the data type
    if (options.data instanceof FormData) {
        axiosInstance.defaults.headers.common.Accept = 'multipart/form-data';
    }

    const onSuccess = (response: AxiosResponse) => response;
    const onError = (response: any) => {
        throw new Error(response?.response?.data?.message);
    };

    //* options will contain the request type and data
    return axiosInstance(options).then(onSuccess).catch(onError);
};
