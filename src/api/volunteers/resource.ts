import { endpoints } from "../constants"
import { GET_API } from "../request"

export const getResources = async() => {
    const endpoint = endpoints.resources.get
    const response = await GET_API(endpoint);
    console.log("Resources: ", response.data);
    
    return response.data || "";
}