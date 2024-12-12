import moment from "moment";

export const getTime = (date: Date): string => {
    if (!date) return "";

    return moment(date).format("h:mm A");
};

// Optional: Add a helper function for full date-time formatting
export const formatDateTime = (date: string | Date): string => {
    return moment(date).format("MMMM D, YYYY h:mm A");
};
