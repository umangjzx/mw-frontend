import { endpoints } from "../constants";
import { GET_API, PUT_API } from "../request";

export const getIndividualLearner = async (learnerId: string) => {
    const response: any = await GET_API(
        endpoints.learner.getIndividualLearner(learnerId as string)
    );
    return response.data;
};

export const updateLearnerProfile = async (learnerId: string, data: any, formData: any) => {
    let dataToSubmit = data || {};

    dataToSubmit.learner_personal_info.learner_first_name = formData?.learner_first_name;
    dataToSubmit.learner_personal_info.learner_last_name = formData?.learner_last_name;
    dataToSubmit.learner_special_needs.description = formData?.learner_description;

    dataToSubmit.learner_personal_info.learner_contact_details = {
        ...data?.learner_personal_info?.learner_contact_details,
        contact_number: formData?.contact_number,
        email: formData?.email,
        country: formData?.country,
    };

    dataToSubmit.learner_personal_info.learner_primary_language = formData?.learner_language;
    dataToSubmit.learner_goals.subjects_to_focus_on = formData?.learner_subjects;
    dataToSubmit.profile_picture = formData?.profile_picture;

    const response: any = await PUT_API(endpoints.learner.update(learnerId as string), dataToSubmit);
    return response?.status;
}