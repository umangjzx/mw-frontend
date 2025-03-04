import { endpoints } from "../constants";
import { GET_API, PUT_API } from "../request";

export const getIndividualLearner = async (learnerId: string) => {
    const response: any = await GET_API(
        endpoints.learner.getIndividualLearner(learnerId as string)
    );
    return response.data;
};

export const updateLearnerProfile = async (learnerId: string, data: any) => {
    const response: any = await PUT_API(endpoints.learner.update(learnerId as string), data);
    return response?.status;
}