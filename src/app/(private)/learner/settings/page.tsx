"use client";
import { endpoints } from "@/api/constants";
import { GET_API, PUT_API } from "@/api/request";
import { getHeaderIcon } from "@/layouts/helper";
import { useComponentStore } from "@/store/useComponenetStore";
import { Switch } from "antd";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();
    const learnerId = Cookies.get("learner_id");
    const [isLoading, setIsLoading] = useState(false);

    const handlePermission = (value: any) => {
        setIsEnabled(value);

        PUT_API(endpoints.chat.learnerPermission(learnerId as string), {
            chat_permission: value,
        }).then((res) => {
            console.log(res, "PERMISSION LEARNER");
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
        GET_API(endpoints.learner.getIndividualLearner(learnerId as string))
            .then((res: any) => {
                setIsEnabled(res.data.chat_permission);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    return (
        <div className="w-full h-full bg-white flex border border-gray-200 md:rounded-tl-[3rem] animate-fadeIn">
            <div className=" p-4  bg-[#f4f7fb] md:bg-transparent md:p-10 flex flex-col md:gap-8 gap-4 w-full">
                <p className="md:text-2xl text-[16px] font-medium">Message Permission Settings</p>
                <div className="flex bg-[#FFFFFF]   rounded-[12px] p-3 md:p-0 md:bg-transparent justify-between gap-2 items-center w-full">
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
