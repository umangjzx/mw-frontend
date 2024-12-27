import { endpoints } from "../constants";
import { GET_API } from "../request";

export const getIndividualVolunteer = async (volunteerId: string) => {
    const response: any = await GET_API(
        endpoints.volunteer.getIndividualVolunteer(volunteerId as string)
    );
    return response.data;
};