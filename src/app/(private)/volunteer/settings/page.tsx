"use client";
import { endpoints } from "@/api/constants";
import { GET_API, PUT_API } from "@/api/request";
import { getHeaderIcon } from "@/layouts/helper";
import { useComponentStore } from "@/store/useComponenetStore";
import { Switch } from "antd";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();
    const volunteerId = Cookies.get("volunteer_id");
    const [isLoading, setIsLoading] = useState(false);

    const handlePermission = (value: any) => {
        setIsEnabled(value);
        PUT_API(endpoints.chat.volunteerPermission(volunteerId as string), {
            chat_permission: value,
        }).then((res) => {
            console.log(res, "PERMISSION VOLUNTEER");
        });
    };

    useEffect(() => {
        setHeaderOptions({
            title: "Settings",
            titleIcon: getHeaderIcon(pathname),
            hideSearch: true,
        });
    }, [setHeaderOptions]);

    useEffect(() => {
        setIsLoading(true);
        GET_API(endpoints.volunteer.getIndividualVolunteer(volunteerId as string))
            .then((res) => {
                setIsEnabled(res.data.chat_permission);
                // console.log(res.data.chat_permission, "RES DATA VOLUNTEER");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="w-full h-full bg-white flex border border-gray-200 md:rounded-tl-[3rem] animate-fadeIn">
            <div className="md:p-10 p-4 flex bg-[#f4f7fb] md:bg-transparent flex-col md:gap-8 gap-4 w-full">
                <p className="md:text-2xl text-[16px] font-medium">Message Permission Settings</p>
                <div className="flex bg-white p-3 md:p-0 rounded-[12px] md:bg-transparent justify-between gap-2 items-center w-full">
                    <div className="flex flex-col gap-2">
                        <p className="md:text-base text-[14px] font-medium">
                            Allow messages from volunteers to reach you.
                        </p>
                        <p className="font-normal text-[#4F4F4F] md:text-sm text-[12px]">
                            By enabling this, you agree to receive communication from volunteers.
                        </p>
                    </div>
                    <Switch
                        checked={isEnabled}
                        loading={isLoading}
                        onChange={(value) => {
                            handlePermission(value);
                        }}
                        className="w-fit [&.ant-switch-checked]:bg-black"
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
