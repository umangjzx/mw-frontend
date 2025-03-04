import { endpoints } from "../constants";
import { GET_API, PUT_API } from "../request";

export const getIndividualVolunteer = async (volunteerId: string) => {
    const response: any = await GET_API(
        endpoints.volunteer.getIndividualVolunteer(volunteerId as string)
    );
    return response.data;
};

export const updateVolunteerProfile = async (volunteerId: string, data: any) => {
    const response: any = await PUT_API(endpoints.volunteer.update(volunteerId as string), data);
    return response?.status;
}