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

    dataToSubmit.volunteer_personal_info.volunteer_first_name = formData?.volunteer_first_name;
    dataToSubmit.volunteer_personal_info.volunteer_last_name = formData?.volunteer_last_name;
    dataToSubmit.volunteer_special_needs.description = formData?.volunteer_description;

    dataToSubmit.volunteer_personal_info.volunteer_contact_details = {
        ...data?.volunteer_personal_info?.volunteer_contact_details,
        contact_number: formData?.contact_number,
        email: formData?.email,
        country: formData?.country,
    };

    dataToSubmit.volunteer_personal_info.volunteer_primary_language = formData?.volunteer_language;
    dataToSubmit.volunteer_goals.subjects_to_focus_on = formData?.volunteer_subjects;
    dataToSubmit.profile_picture = formData?.profile_picture;

    const response: any = await PUT_API(endpoints.volunteer.update(volunteerId as string), dataToSubmit);
    return response?.status;
}