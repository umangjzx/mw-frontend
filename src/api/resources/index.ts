import { endpoints } from "../constants"
import { DELETE_API, GET_API, POST_API, PUT_API } from "../request"

export const getResources = async () => {
    const endpoint = endpoints.resources.get;
    const { data } = await GET_API(endpoint);
    return data || {};
}

export const addResource = async (payload: any) => {
    const endpoint = endpoints.resources.create;
    const response = await POST_API(endpoint, payload);
    return response;
}

export const getSingleResource = async (resource_id: string) => {
    if(!resource_id) return null;
    const endpoint = endpoints.resources.getResource(resource_id);
    const { data } = await GET_API(endpoint);
    return data || {};
}

export const updateResource = async (resource_id: string, payload: any) => {
    if(!resource_id) return null;
    const endpoint = endpoints.resources.update(resource_id);
    const { data } = await PUT_API(endpoint, payload);
    return data || {};
}

export const deleteResource = async (resource_id: string) => {
    if(!resource_id) return null;
    const endpoint = endpoints.resources.delete(resource_id);
    const { status } = await DELETE_API(endpoint);
    return status;
}