import { endpoints } from "../constants";
import { GET_API, PUT_API } from "../request";

export const getIndividualVolunteer = async (volunteerId: string) => {
    const response: any = await GET_API(
        endpoints.volunteer.getIndividualVolunteer(volunteerId as string)
    );
    return response.data;
};

export const updateVolunteerProfile = async (volunteerId: string, data: any, formData: any) => {
    let dataToSubmit = data || {};

    dataToSubmit.volunteer_first_name = formData?.volunteer_first_name;
    dataToSubmit.volunteer_last_name = formData?.volunteer_last_name;
    dataToSubmit.volunteer_description = formData?.volunteer_description;

    dataToSubmit.volunteer_contact_details = {
        ...data?.volunteer_contact_details,
        country: formData?.country,
    };

    dataToSubmit.volunteer_languages = formData?.volunteer_languages;
    dataToSubmit.volunteer_skills = formData?.volunteer_skills;
    dataToSubmit.volunteer_subjects = formData?.volunteer_subjects;

    dataToSubmit.profile_picture = formData?.profile_picture;

    const response: any = await PUT_API(endpoints.volunteer.update(volunteerId as string), dataToSubmit);
    return response?.status;
}