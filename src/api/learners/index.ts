import { endpoints } from "../constants";
import { GET_API } from "../request";

export const getIndividualLearner = async (learnerId: string) => {
    const response: any = await GET_API(
        endpoints.learner.getIndividualLearner(learnerId as string)
    );
    return response.data;
};