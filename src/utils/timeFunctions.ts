import moment from "moment-timezone";

type UserTimeZoneProps = {
    date: string,
    timeZone?: string,
    format?: string
}

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || moment.tz.guess();

export const toUserTimeZone = ( { date, timeZone = localTimeZone, format = "YYYY-MM-DD HH:mm:ss" }: UserTimeZoneProps) => {
    if (!date) return "";
    return moment.utc(date).tz(timeZone).format(format);
};
