import moment from "moment";
import { GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import Cookies from "js-cookie";

interface EventResponse {
    session_title: string;
    session_date: string;
    session_start_time: string;
    session_end_time: string;
    session_description: string;
    meet_link: string;
    session_id: string;
    volunteer_id: string;
    volunteer_full_name: string;
    learner_id: string;
    learner_first_name: string;
    learner_last_name: string;
    learner_picture: string;
    status: string;
    feedback_collected_from_learner: boolean;
    feedback_collected_from_volunteer: boolean;
}

interface CalendarEvent {
    title: string;
    date: string;
    start: string;
    end: string;
    backgroundColor: string;
    classNames: string[];
    textColor: string;
    borderColor: string;
    status: string;
    extendedProps: {
        description?: string;
        meetLink?: string;
        sessionId?: string;
        volunteerId?: string;
        volunteer_full_name?: string;
        learner?: {
            id: string;
            firstName: string;
            lastName: string;
            picture: string;
        };
        feedBackCollectedFromLearner?: boolean;
        feedBackCollectedFromVolunteer?: boolean;
        volunteer_slot_id?: string;
        isAvailableSlot?: boolean;
    };
}

export const getCalendarEvents = async (
    userId: string,
    userType: "volunteer" | "learner",
    currentMonth?: string
) => {
    const monthParam = currentMonth
        ? moment(currentMonth).format("YYYY-MM")
        : moment().format("YYYY-MM");

    const role = Cookies.get("role");

    const endpoint =
        role === "volunteer"
            ? endpoints.volunteer_slot.getAllSlotsForMonth(monthParam)
            : endpoints.session.getCalendarEvents(userId, role as UserType, monthParam);

    const response = await GET_API(endpoint);

    console.log(response.data, "response");

    if (role === "volunteer") {
        const events: CalendarEvent[] = [];

        // Process each day's data
        response?.data?.forEach((dayData: any) => {
            // Process each slot in the day
            dayData.slots?.forEach((slot: any) => {
                if (slot.session_details) {
                    // If there's a session, create an event with the session details
                    events.push({
                        title: slot.session_details.session_title,
                        date: slot.session_details.session_date,
                        start: moment(
                            `${slot.session_details.session_date} ${slot.session_details.session_start_time}`
                        ).format(),
                        end: moment(
                            `${slot.session_details.session_date} ${slot.session_details.session_end_time}`
                        ).format(),
                        backgroundColor: "var(--success-light-color)",
                        classNames: ["event-item", "rounded-md", "py-1", "my-0.5"],
                        textColor: "var(--success-color)",
                        borderColor: "var(--success-color)",
                        status: slot.session_details.status,
                        extendedProps: {
                            description: slot.session_details.session_description,
                            meetLink: slot.session_details.meet_link,
                            sessionId: slot.session_details.session_id,
                            volunteerId: slot.session_details.volunteer_id,
                            volunteer_full_name: slot.session_details.volunteer_full_name,
                            learner: {
                                id: slot.session_details.learner_id,
                                firstName: slot.session_details.learner_first_name,
                                lastName: slot.session_details.learner_last_name,
                                picture: slot.session_details.learner_picture,
                            },
                            feedBackCollectedFromLearner:
                                slot.session_details.feedback_collected_from_learner,
                            feedBackCollectedFromVolunteer:
                                slot.session_details.feedback_collected_from_volunteer,
                        },
                    });
                } else {
                    // If there's no session but there's a slot, create a "no event" card
                    // Only show for future dates
                    const slotDate = moment(dayData.date);
                    const currentDate = moment().startOf("day");

                    if (slotDate.isSameOrAfter(currentDate)) {
                        events.push({
                            title: "No Event",
                            date: dayData.date,
                            start: moment(`${dayData.date} ${slot.start_time}`).format(),
                            end: moment(`${dayData.date} ${slot.end_time}`).format(),
                            backgroundColor: "var(--gray-100)",
                            classNames: ["event-item", "rounded-md", "py-1", "my-0.5"],
                            textColor: "var(--gray-500)",
                            borderColor: "var(--gray-300)",
                            status: "available",
                            extendedProps: {
                                volunteer_slot_id: slot.volunteer_slot_id,
                                isAvailableSlot: true,
                            },
                        });
                    }
                }
            });
        });
        console.log(events, "events from calender");
        return events;
    } else {
        return (
            response?.data?.items?.map((item: EventResponse) => ({
                title: item.session_title,
                date: item.session_date,
                start: moment(`${item.session_date} ${item.session_start_time}`).format(),
                end: moment(`${item.session_date} ${item.session_end_time}`).format(),
                backgroundColor: "var(--success-light-color)",
                classNames: ["event-item", "rounded-md", "py-1", "my-0.5"],
                textColor: "var(--success-color)",
                borderColor: "var(--success-color)",
                status: item.status,
                extendedProps: {
                    description: item.session_description,
                    meetLink: item.meet_link,
                    sessionId: item.session_id,
                    volunteerId: item.volunteer_id,
                    volunteer_full_name: item.volunteer_full_name,
                    learner: {
                        id: item.learner_id,
                        firstName: item.learner_first_name,
                        lastName: item.learner_last_name,
                        picture: item.learner_picture,
                    },
                    feedBackCollectedFromLearner: item.feedback_collected_from_learner,
                    feedBackCollectedFromVolunteer: item.feedback_collected_from_volunteer,
                },
            })) || []
        );
    }
};

export const getTime = (date: Date): string => {
    if (!date) return "";

    return moment(date).format("h:mm A");
};

// Optional: Add a helper function for full date-time formatting
export const formatDateTime = (date: string | Date): string => {
    return moment(date).format("MMMM D, YYYY h:mm A");
};

// Fun: Converts railway time(24 hrs) to normal time(12 hrs)
export const formatTime = (railwayTimeString: string) =>
    moment(railwayTimeString, "HH:mm").format("hh:mm A");

export const formatDate = (date: string) => moment(date).format("YYYY-MM-DD");

// Fun: Converts date into day with month i.e. 12th Apr
export const formatDateSuffix = (date: Date | string) => moment(date).format("Do MMM");

export const checkCalendarScope = async () => {
    const response = await GET_API(endpoints.auth.checkCalendarScope);
    return response;
};

export const revokeGoogleAuth = async () => {
    const response = await GET_API(endpoints.auth.revokeGoogleAuth);
    return response;
};
