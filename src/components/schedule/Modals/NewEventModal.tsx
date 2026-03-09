"use client";

import { useState, useEffect } from "react";
import CenterModal from "@/components/common/Modals/CenterModal";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import TagComponent from "@/components/common/Tag";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment-timezone";
import { POST_API, GET_API } from "@/api/request";
import { endpoints } from "@/api/constants";
import { showToast } from "@/components/common/Toast";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import useInnerWidth from "@/hooks/useInnerWidth";
import ModalCloseIcon from "@/assets/icons/ModalCloseIcon";
import { extractTimezoneOffset } from "@/utils/timeFunctions";

/* Full-screen mobile modal: align wrap to top and make content fill viewport */
const fullScreenMobileStyles = (
    <style
        dangerouslySetInnerHTML={{
            __html: `
            @media (max-width: 767px) {
                .ant-modal-wrap:has(.new-event-modal-fullscreen-mobile) {
                    align-items: flex-start !important;
                }
                .new-event-modal-fullscreen-mobile.ant-modal {
                    max-width: 100vw !important;
                    top: 0 !important;
                    padding: 0 !important;
                }
                .new-event-modal-fullscreen-mobile .ant-modal-content {
                    height: 100dvh !important;
                    max-height: 100dvh !important;
                    border-radius: 0 !important;
                }
            }
        `,
        }}
    />
);

interface Skill {
    skill_id: string;
    skill_name: string;
}

interface NewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: NewEventData) => void;
    /** When provided, used for the instant session. When omitted, slots for the selected date are fetched and the first slot is used. */
    volunteer_slot_id?: string;
}

export interface NewEventData {
    select_date: Date | null;
    duration: string;
    start_time: string;
    title: string;
    description: string;
    tags: string[];
}

const durationOptions = [
    { label: "15 mins", value: "15" },
    { label: "30 mins", value: "30" },
    { label: "45 mins", value: "45" },
    { label: "1 hour", value: "60" },
    { label: "1.5 hours", value: "90" },
    { label: "2 hours", value: "120" },
];

/** Request body for POST /api/v1/session/instant_session */
interface InstantSessionPayload {
    volunteer_slot_id: string;
    date: string;
    duration: number;
    start_time: string;
    title: string;
    description: string;
    tag_ids: string[];
}

export default function NewEventModal({
    isOpen,
    onClose,
    onSubmit,
    volunteer_slot_id: volunteerSlotIdProp,
}: NewEventModalProps) {
    const [formData, setFormData] = useState<NewEventData>({
        select_date: new Date(),
        duration: "",
        start_time: "",
        title: "",
        description: "",
        tags: [],
    });

    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [skillSelectValue, setSkillSelectValue] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Temporary time state for mobile time picker dialog
    const [tempTime, setTempTime] = useState<dayjs.Dayjs | null>(null);
    // Track the original tempTime when picker opens, so we can reset on cancel
    const [originalTempTime, setOriginalTempTime] = useState<dayjs.Dayjs | null>(null);
    // Track selected meridiem explicitly to ensure PM hours show immediately
    const [selectedMeridiem, setSelectedMeridiem] = useState<string | null>(null);

    const { volunteerDetails, volunteerUtcOffset } = useAppStore();
    const timezoneRaw =
        (volunteerDetails as { volunteer_contact_details?: { timezone?: string; utc_offset?: string } })
            ?.volunteer_contact_details?.timezone ?? "";

    const volunteerTimezone = timezoneRaw.includes(" - ") ? timezoneRaw.split(" - ")[0]?.trim() ?? timezoneRaw : timezoneRaw;

    // Get UTC offset from volunteerDetails or store, with fallback to extracting from timezone string
    const volunteerUtcOffsetValue =
        (volunteerDetails as { volunteer_contact_details?: { utc_offset?: string } })
            ?.volunteer_contact_details?.utc_offset ||
        volunteerUtcOffset ||
        (timezoneRaw ? extractTimezoneOffset(timezoneRaw) : null);

    // Get today's date in YYYY-MM-DD format in volunteer's timezone
    const getTodayDate = () => {
        if (volunteerUtcOffsetValue) {
            // Get current date in volunteer's timezone
            const todayInTimezone = moment().utcOffset(volunteerUtcOffsetValue);
            return todayInTimezone.format("YYYY-MM-DD");
        }
        return dayjs().format("YYYY-MM-DD");
    };

    // Get today's date as a Date object in volunteer's timezone
    const getTodayDateObject = (): Date => {
        if (volunteerUtcOffsetValue) {
            // Get current date in volunteer's timezone
            const todayInTimezone = moment().utcOffset(volunteerUtcOffsetValue);
            const dateStr = todayInTimezone.format("YYYY-MM-DD");
            // Create a Date object from the date string (YYYY-MM-DD format is interpreted as local midnight)
            // We need to create it in a way that represents the correct date
            const [year, month, day] = dateStr.split("-").map(Number);
            return new Date(year, month - 1, day);
        }
        return new Date();
    };

    // Reset all form fields when modal opens
    useEffect(() => {
        if (isOpen) {
            // Get today's date in volunteer's timezone (AST)
            const todayInTimezone = getTodayDateObject();
            setFormData({
                select_date: todayInTimezone,
                duration: "",
                start_time: "",
                title: "",
                description: "",
                tags: [],
            });
            setSkillSelectValue(null);
            setSelectedSkills([]);
            setTempTime(null);
            setOriginalTempTime(null);
            setSelectedMeridiem(null);
        }
    }, [isOpen, volunteerUtcOffsetValue]);

    // Sync tempTime with formData.start_time (keep null when empty so input field stays empty)
    useEffect(() => {
        if (formData.start_time) {
            setTempTime(dayjs(formData.start_time, "HH:mm"));
        } else {
            setTempTime(null);
        }
    }, [formData.start_time]);

    const { data: skillsData } = useQuery({
        queryKey: ["common-skills"],
        queryFn: async () => {
            const res = await GET_API(endpoints.common("skills"));
            return res?.data as Skill[];
        },
        enabled: isOpen,
    });
    const skills: Skill[] = Array.isArray(skillsData) ? skillsData : [];
    const skillOptions = skills.map((s) => ({ label: s.skill_name, value: s.skill_id }));

    // Check if it's PM today to disable AM option
    const isPMToday = (() => {
        if (!formData.select_date) return false;
        const selectedDateStr = dayjs(formData.select_date).format("YYYY-MM-DD");

        // Use moment for timezone calculation
        let currentTimeInTimezone: moment.Moment;
        if (volunteerUtcOffsetValue) {
            currentTimeInTimezone = moment().utcOffset(volunteerUtcOffsetValue);
        } else {
            currentTimeInTimezone = moment();
        }

        const currentDateStr = currentTimeInTimezone.format("YYYY-MM-DD");
        const currentMeridiem = currentTimeInTimezone.format("A");

        return selectedDateStr === currentDateStr && currentMeridiem === "PM";
    })();

    // Use DOM manipulation to hide/disable AM option when it's PM (works for both web and mobile)
    useEffect(() => {
        if (!isPMToday || !isOpen) return;

        const disableAMOption = () => {
            // Try multiple selectors to find AM option in MUI TimePicker (both desktop and mobile)
            const selectors = [
                '.MuiMultiSectionDigitalClockSection-item[data-value="AM"]',
                '.MuiMultiSectionDigitalClockSection-item:has-text("AM")',
                '[role="option"][aria-label*="AM"]',
                '.MuiPickersClock-meridiemText[data-value="AM"]',
                'button[aria-label*="AM"]',
                'div[role="option"]:has-text("AM")',
                // Mobile-specific selectors
                '.MuiMobileTimePickerToolbar-root [data-value="AM"]',
                '.MuiMobileTimePickerToolbar-root button:has-text("AM")',
                '.MuiPickersToolbar-root [data-value="AM"]',
                '.MuiPickersToolbar-root button:has-text("AM")',
                // General mobile time picker selectors
                '[class*="MobileTimePicker"] [data-value="AM"]',
                '[class*="MobileTimePicker"] button:has-text("AM")',
            ];

            selectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((el: any) => {
                        const text = el?.textContent?.trim() || el?.innerText?.trim() || '';
                        const ariaLabel = el?.getAttribute('aria-label') || '';
                        const dataValue = el?.getAttribute('data-value') || '';

                        if (text === 'AM' || ariaLabel.includes('AM') || dataValue === 'AM') {
                            // Hide and disable the AM option
                            (el as HTMLElement).style.display = 'none';
                            (el as HTMLElement).style.visibility = 'hidden';
                            (el as HTMLElement).style.pointerEvents = 'none';
                            (el as HTMLElement).style.opacity = '0';
                            (el as HTMLElement).setAttribute('disabled', 'true');
                            (el as HTMLElement).setAttribute('aria-disabled', 'true');
                        }
                    });
                } catch (e) {
                    // Ignore selector errors
                }
            });

            // Also try to find by text content more broadly - ONLY target AM, never PM
            // This works for both desktop and mobile time pickers
            const allElements = document.querySelectorAll(
                '.MuiMultiSectionDigitalClockSection-item, [role="option"], button, [class*="TimePicker"] button, [class*="TimePicker"] [role="option"]'
            );
            allElements.forEach((el: any) => {
                const text = el?.textContent?.trim() || el?.innerText?.trim() || '';
                // ONLY disable AM, make sure we never touch PM
                if (text === 'AM' && text !== 'PM') {
                    (el as HTMLElement).style.display = 'none';
                    (el as HTMLElement).style.visibility = 'hidden';
                    (el as HTMLElement).style.pointerEvents = 'none';
                    (el as HTMLElement).style.opacity = '0';
                    (el as HTMLElement).setAttribute('disabled', 'true');
                    (el as HTMLElement).setAttribute('aria-disabled', 'true');
                }
            });
        };

        // Run immediately and set up observer for when picker opens (especially important for mobile)
        const timer = setTimeout(disableAMOption, 100);
        // Also run after a longer delay to catch mobile picker that might open later
        const timer2 = setTimeout(disableAMOption, 500);
        const timer3 = setTimeout(disableAMOption, 1000);

        const observer = new MutationObserver(() => {
            disableAMOption();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'data-value', 'aria-label']
        });

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
            clearTimeout(timer3);
            observer.disconnect();
        };
    }, [isPMToday, isOpen, formData.select_date]);

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, select_date: date }));
    };

    const handleDurationChange = (value: string | number) => {
        setFormData((prev) => ({ ...prev, duration: String(value) }));
    };

    // Fetch available slots for the selected date
    const { data: slotsData, refetch: refetchSlots } = useQuery({
        queryKey: ["available-slots", dayjs(formData.select_date).format("YYYY-MM-DD")],
        queryFn: async () => {
            if (!formData.select_date) return [];
            const dateStr = dayjs(formData.select_date).format("YYYY-MM-DD");
            try {
                const res = await GET_API(
                    endpoints.volunteer_slot.getAvailableDaysForDate(dateStr)
                );
                return res?.data?.slots || [];
            } catch (error) {
                console.error("Error fetching slots:", error);
                return [];
            }
        },
        enabled: !!formData.select_date,
    });

    const handleTimeChange = (time: dayjs.Dayjs | null) => {
        if (time) {
            setFormData((prev) => ({ ...prev, start_time: time.format("HH:mm") }));
        }
    };

    const handleTimeAccept = (time: dayjs.Dayjs | null) => {
        if (time) {
            setFormData((prev) => ({ ...prev, start_time: time.format("HH:mm") }));
        }
    };

    const shouldDisableTime = (timeValue: dayjs.Dayjs, clockType: string | any) => {
        if (!formData.select_date) return false;

        const selectedDate = dayjs(formData.select_date);
        const selectedDateStr = selectedDate.format("YYYY-MM-DD");

        // Get current time in volunteer's timezone
        let currentTimeInTimezone: moment.Moment;
        if (volunteerUtcOffsetValue) {
            // Use UTC offset to get current time in volunteer's timezone
            currentTimeInTimezone = moment().utcOffset(volunteerUtcOffsetValue);
        } else {
            // Fallback to local time if no offset available
            currentTimeInTimezone = moment();
        }

        const currentDateStr = currentTimeInTimezone.format("YYYY-MM-DD");
        const currentTimeStr = currentTimeInTimezone.format("HH:mm");
        const currentHour = parseInt(currentTimeStr.split(":")[0]);
        const currentMinute = parseInt(currentTimeStr.split(":")[1]);
        const currentMeridiem = currentTimeInTimezone.format("A"); // "AM" or "PM"

        // If selected date is in the past, disable all times
        if (selectedDateStr < currentDateStr) {
            return true;
        }

        // Helper function to check if a time slot is booked
        const isTimeSlotBooked = (timeStr: string): boolean => {
            if (!slotsData || !Array.isArray(slotsData)) return false;
            return slotsData.some((slot: any) => {
                return timeStr >= slot.start_time && timeStr < slot.end_time;
            });
        };

        // Handle AM/PM (meridiem) selection - disable AM if currently PM (only for today)
        // This works the same way as hours/minutes disabling - if it's PM, all AM times are in the past
        if (selectedDateStr === currentDateStr && currentMeridiem === "PM") {
            const selectedMeridiem = timeValue.format("A");
            const selectedHour24 = timeValue.hour();
            const selectedHour12 = parseInt(timeValue.format("h")); // 1-12 format

            // Handle meridiem selection specifically (when user clicks AM/PM)
            if (clockType === "meridiem") {
                // Only disable AM when it's currently PM, always allow PM
                if (selectedMeridiem === "AM") {
                    return true; // Disable AM when it's PM - all AM times are in the past
                }
                // Always allow PM selection
                return false;
            }

            // If we're selecting AM and it's currently PM, disable AM (same logic as disabling past hours/minutes)
            // Check multiple ways to catch meridiem selection
            if (selectedMeridiem === "AM") {
                return true; // Disable AM when it's PM - all AM times are in the past
            }

            // Also check by hour: if hour is 1-11 with AM meridiem, disable when it's PM
            // Hour 12 with AM is midnight (12:00 AM), also disable when it's PM
            // IMPORTANT: Only disable if meridiem is AM, never disable PM
            if (clockType === "hours" && selectedMeridiem === "AM") {
                // If hour is in AM range (1-11) or hour 12 with AM, disable when it's PM
                if (selectedHour12 >= 1 && selectedHour12 <= 11) {
                    console.log("Disabling AM hour because it's PM");
                    return true;
                }
                if (selectedHour12 === 12 && selectedMeridiem === "AM") {
                    console.log("Disabling 12 AM (midnight) because it's PM");
                    return true;
                }
            }
        }

        // For meridiem selection on future dates or when it's AM, always allow both AM and PM
        if (clockType === "meridiem") {
            return false; // Never disable meridiem selection for future dates or when it's AM
        }

        // If selected date is today, check if time is in the past
        if (selectedDateStr === currentDateStr) {
            if (clockType === "hours") {
                // Get the hour in 12-hour format (1-12) from the clock face
                const hour12 = parseInt(timeValue.format("h")); // 1-12 format

                // Check what meridiem is currently selected
                // Priority: 1) selectedMeridiem state (tracks explicit PM/AM clicks), 2) tempTime, 3) timeValue
                const tempTimeMeridiem = tempTime ? tempTime.format("A") : null;
                const timeValueMeridiem = timeValue.format("A");

                // Determine current meridiem: use selectedMeridiem state first (most reliable for immediate PM clicks)
                // then tempTime, then timeValue, then default to being permissive
                const currentSelectedMeridiem = selectedMeridiem || tempTimeMeridiem || (timeValueMeridiem === "PM" || timeValueMeridiem === "AM" ? timeValueMeridiem : null);

                // Convert 12-hour format to 24-hour format based on selected meridiem
                let actualHour24: number;

                if (currentSelectedMeridiem === "PM") {
                    // PM selected: 1-11 PM = 13-23, 12 PM = 12 (noon)
                    if (hour12 === 12) {
                        actualHour24 = 12; // 12 PM = noon
                    } else {
                        actualHour24 = hour12 + 12; // 1-11 PM = 13-23
                    }
                } else if (currentSelectedMeridiem === "AM") {
                    // AM selected: 1-11 AM = 1-11, 12 AM = 0 (midnight)
                    if (hour12 === 12) {
                        actualHour24 = 0; // 12 AM = midnight
                    } else {
                        actualHour24 = hour12; // 1-11 AM = 1-11
                    }
                } else {
                    // No meridiem selected yet - be very permissive, default to PM
                    // This is critical: when user clicks PM, meridiem might not be set in timeValue yet
                    // So we default to PM to ensure hours show immediately
                    let amHour24: number;
                    let pmHour24: number;

                    if (hour12 === 12) {
                        amHour24 = 0; // 12 AM = midnight
                        pmHour24 = 12; // 12 PM = noon
                    } else {
                        amHour24 = hour12; // 1-11 AM
                        pmHour24 = hour12 + 12; // 1-11 PM
                    }

                    // If both AM and PM versions are in the past, disable
                    if (amHour24 < currentHour && pmHour24 < currentHour) {
                        return true;
                    }

                    // Always default to PM when meridiem is unclear - this ensures PM hours show
                    // immediately when user clicks PM, matching desktop behavior
                    // Only use AM if PM is clearly in the past and AM is in the future
                    if (pmHour24 >= currentHour) {
                        actualHour24 = pmHour24; // Default to PM - allows PM hours to show immediately
                    } else if (amHour24 >= currentHour) {
                        actualHour24 = amHour24; // Use AM only if PM is past and AM is future
                    } else {
                        return true; // Both are in the past
                    }
                }

                // If hour is in the past (next hour or later), disable it
                // Special case: hour 12 (noon) should be disabled after 1:00 PM
                if (actualHour24 < currentHour) {
                    return true;
                }

                // If hour is current hour, check if all 15-minute slots are unavailable (past or booked)
                if (actualHour24 === currentHour) {
                    const minutesToCheck = [0, 15, 30, 45];
                    // Disable hour if all 15-minute intervals are either past or booked
                    // But for hour 12 (noon), keep it enabled if we're still in the 12:XX hour
                    // This allows users to see hour 12 during 12:00-12:59 PM
                    if (hour12 === 12 && currentSelectedMeridiem === "PM" && actualHour24 === 12 && currentHour === 12) {
                        // Hour 12 (noon) is current hour - keep it enabled so user can see it
                        // Minute picker will handle disabling past minutes
                        return false;
                    }

                    // For other hours, check if all slots are unavailable
                    return minutesToCheck.every((minute) => {
                        const timeStr = dayjs().hour(actualHour24).minute(minute).format("HH:mm");
                        // Check if time is in the past - be precise with comparison
                        if (timeStr < currentTimeStr) {
                            return true; // Past time
                        }
                        // If time is exactly current time or future, check if booked
                        return isTimeSlotBooked(timeStr);
                    });
                }
                // For future hours today, check if all slots in the hour are booked
                const minutesToCheck = [0, 15, 30, 45];
                return minutesToCheck.every((minute) => {
                    const timeStr = dayjs().hour(actualHour24).minute(minute).format("HH:mm");
                    return isTimeSlotBooked(timeStr);
                });
            } else {
                // For minutes view on today
                const timeStr = timeValue.format("HH:mm");
                // Check if time is in the past - allow times that are >= current time
                if (timeStr < currentTimeStr) {
                    return true;
                }
                // Check if slot is booked
                return isTimeSlotBooked(timeStr);
            }
        }

        // For future dates, only check if slots are booked
        if (clockType === "hours") {
            const minutesToCheck = [0, 15, 30, 45];
            const hour = timeValue.hour();
            // Check if all 15-minute slots in this hour are booked
            return minutesToCheck.every((minute) => {
                const timeStr = timeValue.hour(hour).minute(minute).format("HH:mm");
                return isTimeSlotBooked(timeStr);
            });
        }

        // For minutes view on future dates
        const timeStr = timeValue.format("HH:mm");
        return isTimeSlotBooked(timeStr);
    };

    const handleTitleChange = (value: string | string[]) => {
        setFormData((prev) => ({ ...prev, title: Array.isArray(value) ? value[0] : value }));
    };

    const handleDescriptionChange = (value: string) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleAddSkill = (skillId: string) => {
        const skill = skills.find((s) => s.skill_id === skillId);
        if (skill && !selectedSkills.some((s) => s.skill_id === skillId)) {
            setSelectedSkills((prev) => [...prev, skill]);
            setSkillSelectValue(null);
        }
    };

    const handleRemoveSkill = (skillId: string) => {
        setSelectedSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
        // Clear the input field to ensure the removed tag can be selected again
        setSkillSelectValue(null);
    };

    // Helper function to check if time slots overlap
    const areSlotsOverlapping = (start1: string, end1: string, start2: string, end2: string): boolean => {
        const start1Minutes = dayjs(start1, "HH:mm");
        const end1Minutes = dayjs(end1, "HH:mm");
        const start2Minutes = dayjs(start2, "HH:mm");
        const end2Minutes = dayjs(end2, "HH:mm");

        return start1Minutes.isBefore(end2Minutes) && end1Minutes.isAfter(start2Minutes);
    };

    // Helper function to calculate end time from start time and duration
    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
        return dayjs(startTime, "HH:mm").add(durationMinutes, "minute").format("HH:mm");
    };

    const handleSubmit = async () => {
        if (!formData.duration || !formData.start_time || !formData.title?.trim()) {
            showToast({ message: "Please fill in Duration, start time and title", type: "error" });
            return;
        }
        if (selectedSkills.length === 0) {
            showToast({ message: "Please add tags", type: "error" });
            return;
        }

        // Validate that the selected time is not in the past
        const dateStr = formData.select_date
            ? dayjs(formData.select_date).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD");

        // Get current time in volunteer's timezone using moment
        let currentTimeInTimezone: moment.Moment;
        if (volunteerUtcOffsetValue) {
            currentTimeInTimezone = moment().utcOffset(volunteerUtcOffsetValue);
        } else {
            currentTimeInTimezone = moment();
        }

        const currentDateStr = currentTimeInTimezone.format("YYYY-MM-DD");
        const currentTimeStr = currentTimeInTimezone.format("HH:mm");

        // Check if selected date is in the past
        if (dateStr < currentDateStr) {
            showToast({ message: "Cannot create session for a past date", type: "error" });
            return;
        }

        // Check if selected time is in the past (only for today)
        if (dateStr === currentDateStr) {
            const selectedTimeStr = formData.start_time;
            if (selectedTimeStr < currentTimeStr) {
                showToast({ message: "Cannot create session for a past time", type: "error" });
                return;
            }
        }

        // Check for overlapping time slots
        if (slotsData && Array.isArray(slotsData) && slotsData.length > 0) {
            const durationMinutes = Number(formData.duration) || 0;
            const newStartTime = formData.start_time;
            const newEndTime = calculateEndTime(newStartTime, durationMinutes);

            // Check if the new slot overlaps with any existing slot
            const hasOverlap = slotsData.some((slot: any) => {
                if (!slot.start_time || !slot.end_time) return false;

                // Check for exact match
                if (slot.start_time === newStartTime && slot.end_time === newEndTime) {
                    return true;
                }

                // Check for overlap
                return areSlotsOverlapping(
                    newStartTime,
                    newEndTime,
                    slot.start_time,
                    slot.end_time
                );
            });

            if (hasOverlap) {
                showToast({
                    message: "Time slot overlaps with an existing session",
                    type: "error"
                });
                return;
            }
        }
        let volunteer_slot_id = volunteerSlotIdProp;
        if (!volunteer_slot_id) {
            // Generate a unique 64-character hex ID (SHA-256 format)
            const array = new Uint8Array(32);
            window.crypto.getRandomValues(array);
            volunteer_slot_id = Array.from(array)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
        }
        const payload: InstantSessionPayload = {
            volunteer_slot_id,
            date: dateStr,
            duration: Number(formData.duration) || 0,
            start_time: formData.start_time,
            title: formData.title.trim(),
            description: formData.description?.trim() ?? "",
            tag_ids: selectedSkills.map((s) => s.skill_id),
        };
        setIsSubmitting(true);
        try {
            const res = await POST_API(endpoints.session.createInstantSession, payload);
            if (res?.status === 200 || res?.status === 201) {
                showToast({ message: "Event created successfully", type: "success" });
                onSubmit?.({ ...formData, tags: selectedSkills.map((s) => s.skill_name) });
                setFormData({
                    select_date: new Date(),
                    duration: "",
                    start_time: "",
                    title: "",
                    description: "",
                    tags: [],
                });
                setSelectedSkills([]);
                setSkillSelectValue(null);
                setTempTime(null);
                setOriginalTempTime(null);
                onClose();
            } else {
                showToast({ message: "Failed to create event", type: "error" });
            }
        } catch {
            showToast({ message: "Failed to create event", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            select_date: new Date(),
            duration: "",
            start_time: "",
            title: "",
            description: "",
            tags: [],
        });
        setSelectedSkills([]);
        setSkillSelectValue(null);
        setTempTime(null);
        setOriginalTempTime(null);
        setSelectedMeridiem(null);
        onClose();
    };

    const innerWidth = useInnerWidth();
    const isMobile = innerWidth > 0 && innerWidth < 768;
    const mobileHeader = (
        <div className="flex items-center gap-3 w-full">
            <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center rounded-full p-0 border-0 bg-transparent active:scale-90 transition-all duration-200 cursor-pointer"
                aria-label="Close"
            >
                <ModalCloseIcon className="active:scale-90 transition-all duration-200" />
            </button>
            <p className="text-[20px] font-medium text-[#1a1a1a]">New Instant Session</p>
        </div>
    );

    return (
        <>
            {fullScreenMobileStyles}
            <CenterModal
                title="New Instant Session"
                headerComponent={isMobile ? mobileHeader : undefined}
                hideCloseIcon={isMobile}
                isOpen={isOpen}
                onClose={handleCancel}
                width={620}
                hideFooter={true}
                customClassName="new-event-modal-fullscreen-mobile !rounded-3xl max-md:!w-screen max-md:!min-h-[100dvh] max-md:!h-[100dvh] max-md:!max-h-[100dvh] max-md:!top-0 max-md:!rounded-none max-md:!m-0"
                rootClassName="!rounded-3xl overflow-hidden max-md:!min-h-full max-md:!h-full"
                headerClassName="!px-6 !py-5"
                bodyClassName="md:!px-6 !p-[20px]"
            >
                <div className="flex flex-col gap-2 max-md:gap-4">
                    {/* Select Date */}
                    <div className="flex flex-col gap-2">
                        <Input
                            name="select_date"
                            label="Select Date"
                            inputType="datepicker"
                            value={formData.select_date}
                            onChange={handleDateChange}
                            disabled={true}
                            format="DD MMMM YYYY"
                            labelClassName="!text-base !text-[#121212]"
                            inputClassName="w-full !h-12 md:!bg-white max-md:!bg-[#E0E0E0] md:!border-gray-200 max-md:!border-[#E0E0E0] md:hover:!bg-white max-md:hover:!bg-[#E0E0E0] md:hover:!border-gray-200 max-md:hover:!border-[#E0E0E0] md:focus:!bg-white max-md:focus:!bg-[#E0E0E0] md:focus:!border-gray-200 max-md:focus:!border-[#E0E0E0] md:[&_.ant-picker]:!bg-white md:[&_.ant-picker]:!border-gray-200 max-md:[&_.ant-picker]:!bg-[#E0E0E0] max-md:[&_.ant-picker]:!border-[#E0E0E0] md:[&_.ant-picker-input>input]:!bg-white max-md:[&_.ant-picker-input>input]:!bg-[#E0E0E0] [&_.ant-picker-input>input]:!text-[#121212] [&_.ant-picker-input>input]:!text-base [&_.ant-picker-suffix]:!text-[#4F4F4F] [&_.ant-picker-suffix_svg]:!text-[#4F4F4F] [&_.ant-picker-suffix_svg]:!fill-[#4F4F4F] [&_.ant-picker-suffix_span]:!text-[#4F4F4F] [&_.ant-picker-suffix_span_svg]:!text-[#4F4F4F] [&_.ant-picker-suffix_span_svg]:!fill-[#4F4F4F]"
                            availableDates={
                                formData.select_date
                                    ? [dayjs(formData.select_date).format("YYYY-MM-DD")]
                                    : [getTodayDate()]
                            }
                        />
                    </div>

                    {/* Duration and Start Time Row */}
                    <div className="grid md:grid-cols-2 gap-[16px] md:gap-5">
                        {/* Duration */}
                        <div className="flex flex-col gap-2">
                            <Input
                                name="duration"
                                label="Duration"
                                inputType="select"
                                value={formData.duration}
                                onChange={handleDurationChange}
                                options={durationOptions}
                                placeholder="Select Duration"
                                labelClassName="!text-base !text-[#121212]"
                                inputClassName="w-full !h-12 [&_.ant-select-selector]:!text-base [&_.ant-select-selector]:!text-[#121212] [&_.ant-select-selection-placeholder]:!text-[#808080] [&_.ant-select-selection-placeholder]:!text-base [&_.ant-select-selection-placeholder]:!font-normal [&.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder]:!text-[#808080] [&.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder]:!text-base [&.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder]:!font-normal"
                            />
                        </div>

                        {/* Start Time */}
                        <div className="flex flex-col gap-2">
                            <label className="md:text-base text-[14px] font-regular text-[#121212]">
                                Start Time{volunteerTimezone ? ` (${volunteerTimezone})` : ""}
                            </label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileTimePicker
                                    format="h:mm A"
                                    value={tempTime}
                                    onChange={(time) => {
                                        // Always update tempTime when time changes
                                        // This includes when user clicks AM/PM (meridiem changes)
                                        // This ensures mobile picker shows hours correctly when PM is selected
                                        setTempTime(time);
                                        // Track meridiem explicitly when it changes
                                        if (time) {
                                            const meridiem = time.format("A");
                                            setSelectedMeridiem(meridiem);
                                        }
                                    }}
                                    onOpen={() => {
                                        // Save the original tempTime value before opening
                                        setOriginalTempTime(tempTime);

                                        // Fetch slots when time picker opens
                                        // This ensures we have the latest slot data for overlap checking
                                        if (formData.select_date) {
                                            refetchSlots();
                                        }

                                        // If tempTime is null, set default time based on current meridiem
                                        // This ensures hours are visible immediately when picker opens
                                        if (!tempTime) {
                                            // Get current time in volunteer's timezone
                                            let currentTimeInTimezone: moment.Moment;
                                            if (volunteerUtcOffsetValue) {
                                                currentTimeInTimezone = moment().utcOffset(volunteerUtcOffsetValue);
                                            } else {
                                                currentTimeInTimezone = moment();
                                            }

                                            const currentMeridiem = currentTimeInTimezone.format("A");
                                            const currentHour = currentTimeInTimezone.hour();

                                            // If it's PM, set default to 12 PM (12:00) to show all PM hours
                                            // If it's AM, set default to current hour or 12 AM
                                            if (currentMeridiem === "PM") {
                                                // Set to 12 PM (12:00) - this ensures all PM hours are visible
                                                const defaultTime = dayjs().hour(12).minute(0).second(0);
                                                setTempTime(defaultTime);
                                                setSelectedMeridiem("PM");
                                            } else {
                                                // If it's AM, set to current hour or 12 AM
                                                const defaultHour = currentHour > 0 ? currentHour : 0;
                                                const defaultTime = dayjs().hour(defaultHour).minute(0).second(0);
                                                setTempTime(defaultTime);
                                                setSelectedMeridiem("AM");
                                            }
                                        } else {
                                            // If tempTime exists, track its meridiem
                                            const meridiem = tempTime.format("A");
                                            setSelectedMeridiem(meridiem);
                                        }
                                    }}
                                    onClose={() => {
                                        // If user cancels without accepting, reset tempTime to original value
                                        // This ensures the input field stays empty if no time was selected
                                        setTempTime(originalTempTime);
                                        setOriginalTempTime(null);
                                    }}
                                    onAccept={(time) => {
                                        // Clear the original tempTime tracking since user accepted
                                        setOriginalTempTime(null);
                                        handleTimeAccept(time);
                                    }}
                                    shouldDisableTime={shouldDisableTime}
                                    closeOnSelect={false}
                                    slotProps={{
                                        textField: {
                                            placeholder: "Select Time",
                                            sx: {
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "6px",
                                                    fontSize: "14px",
                                                    height: "48px",
                                                    backgroundColor: "#f4f7fb",
                                                    "& fieldset": {
                                                        border: "1px solid #e0e0e0",
                                                    },
                                                    "&:hover": {
                                                        backgroundColor: "#f4f7fb",
                                                        "& fieldset": {
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                    },
                                                    "&.Mui-focused": {
                                                        backgroundColor: "#f4f7fb",
                                                        "& fieldset": {
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    padding: "4px 11px",
                                                    fontSize: "14px",
                                                    color: "#1a1a1a",
                                                    height: "48px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    color: "#808080",
                                                    opacity: 1,
                                                    fontSize: "16px",
                                                    fontWeight: 400,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <Input
                            name="title"
                            label="Title"
                            inputType="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="Enter title here"
                            labelClassName="!text-base !text-[#121212]"
                            inputClassName="w-full !h-12 !text-base !text-[#121212] placeholder:!text-[#808080] placeholder:!text-base"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <Input
                            name="description"
                            label="Description (Optional)"
                            inputType="textarea"
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Enter description here"
                            labelClassName="!text-base !text-[#121212]"
                            inputClassName="w-full !h-[100px] !text-base !text-[#121212] placeholder:!text-[#808080] placeholder:!text-base"
                            rows={4}
                        />
                    </div>

                    {/* Tags – search and select from skills, pass skill IDs as tag_ids on post */}
                    <div className="flex flex-col md:gap-2">
                        <label className="md:text-base text-[14px] font-regular text-[#121212]">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                            {selectedSkills.map((skill) => (
                                <TagComponent
                                    key={skill.skill_id}
                                    text={skill.skill_name}
                                    isClose={true}
                                    onClose={() => handleRemoveSkill(skill.skill_id)}
                                />
                            ))}
                        </div>
                        <Input
                            key={`skill-select-${selectedSkills.length}`}
                            name="skill_select"
                            inputType="select"
                            placeholder="Search and select skills"
                            value={skillSelectValue ?? ""}
                            onChange={(value: string | number) => {
                                const id = String(value);
                                handleAddSkill(id);
                            }}
                            options={skillOptions.filter(
                                (opt) => !selectedSkills.some((s) => s.skill_id === opt.value || String(s.skill_id) === String(opt.value))
                            )}
                            showSearch={true}
                            inputClassName="w-full !h-12 [&_.ant-select-selector]:!text-base"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex gap-3 justify-end pt-5 pb-2 border-t border-stroke">
                        <Button
                            title="Cancel"
                            onClick={handleCancel}
                            customClassName="!bg-white !text-black !font-medium rounded-full !px-6 !py-2.5"
                        />
                        <Button
                            title={isSubmitting ? "Creating..." : "Create Event"}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            customClassName="!bg-black !text-white !font-medium rounded-full !px-6 !py-2.5"
                        />
                    </div>
                </div>
                <div className="flex md:hidden gap-3 justify-end pt-5  border-t border-stroke">
                    <Button
                        title="Cancel"
                        onClick={handleCancel}
                        customClassName="!bg-white !text-black !font-medium rounded-full !px-6 !py-2.5"
                    />
                    <Button
                        title={isSubmitting ? "Creating..." : "Create Event"}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        customClassName="!bg-black !text-white !font-medium rounded-full !px-6 !py-2.5"
                    />
                </div>
            </CenterModal>
        </>
    );
}
