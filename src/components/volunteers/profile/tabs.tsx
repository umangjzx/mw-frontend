import ContactDetails from "@/components/profile/Bio/ContactDetails";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { formatString } from "@/utils/stringFormats";
import dayjs from "dayjs";

const InfoItem = ({ label, value }: { label: string, value: string | string[] }) => {
    if (!value) return null;

    const renderValue = (value: string | string[] | { value: string }) => {
        if (Array.isArray(value)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((item, index) => (
                        <p key={index} className="text-xs px-2 py-1 rounded-full font-medium bg-background break-words">
                            {formatString(item)}
                        </p>
                    ))}
                </div>
            );
        }
        return <p className="text-base font-medium break-words">{formatString(typeof value === "object" ? value?.value : value)}</p>;
    };
    
    const isFullWidth = (Array.isArray(value) && value.length > 3) || String(value).length > 40;
    return (
        <div className={`flex flex-col gap-1 ${isFullWidth ? "col-span-2" : ""}`}>
            <p className="text-sm font-normal text-gray-light">{label}</p>
            {renderValue(value)}
        </div>
    )
}

export const ProfileDetails = ({ data }: { data: Volunteer }) => {
    const details = [
        { label: "First Name", value: data?.volunteer_first_name },
        { label: "Last Name", value: data?.volunteer_last_name },
        { label: "Date of Birth", value: dayjs(data?.volunteer_birth_date).format("DD MMM YYYY") },
        { label: "Gender", value: formatString(data?.volunteer_gender) },
        { label: "Languages Spoken", value: data?.volunteer_languages?.map((language) => language.language_name) },
        { label: "Skills", value: data?.volunteer_skills?.map((skill) => skill.skill_name) },
        { label: "Higher Education", value: data?.volunteer_higher_education },
        { label: "Education Summary", value: data?.volunteer_education },
        { label: "Volunteered Experience", value: data?.volunteer_experience },
        { label: "Work Experience", value: data?.volunteer_work_experience },
        { label: "Description", value: data?.volunteer_description },
        { label: "Consented from Parent", value: data?.consented_from_parent ? "Yes" : "No" },
        { label: "Parent Email", value: data?.volunteer_parent_email },
        { label: "Parent Name", value: data?.volunteer_parent_name },
    ].filter(detail => detail.value && Object.keys(detail.value).length);

    return (
        <div>
            <h5 className="text-xl font-semibold mb-3">Profile Details</h5>
            <div className="grid grid-cols-2 gap-3">

                {details.map((detail) => (
                    <InfoItem key={detail.label} label={detail.label} value={detail?.value || ""} />
                ))}
            </div>
        </div>
    )
}


export const VolunteerContactDetails = ({ data }: { data: Volunteercontactdetails }) => {
    const details = [
        { label: "Country", value: data?.country },
        { label: "Zip Code", value: data?.zip_code },
        { label: "Timezone", value: data?.timezone },
        { label: "UTC Offset", value: data?.utc_offset },
    ]

    const contactDetails = [
        { title: "Phone Number", value: data?.contact_number?.number, icon: <FaPhoneAlt size={13} /> },
        { title: "Email", value: data?.email, icon: <MdEmail size={15} /> },
    ]

    return (
        <div>
            <h5 className="text-xl font-semibold mb-3">Contact Details</h5>
            <div className="grid grid-cols-2 gap-3">
                {details.map((detail) => (
                    <InfoItem key={detail.label} label={detail.label} value={detail.value} />
                ))}
                <div className="col-span-2">
                    <ContactDetails tags={contactDetails} />
                </div>
            </div>
        </div>
    )
}
