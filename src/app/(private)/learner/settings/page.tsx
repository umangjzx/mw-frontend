"use client";
import { getHeaderIcon } from "@/layouts/helper";
import { useComponentStore } from "@/store/useComponenetStore";
import { Switch } from "antd";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const { setHeaderOptions } = useComponentStore();
    const pathname = usePathname();

    useEffect(() => {
        setHeaderOptions({
            title: "Settings",
            titleIcon: getHeaderIcon(pathname),
            hideSearch: true,
        });
    }, [setHeaderOptions]);
    return (
        <div className="w-full h-full bg-white flex border border-gray-200 rounded-tl-[3rem] animate-fadeIn">
            <div className="p-10 flex flex-col gap-8 w-full">
                <p className="text-2xl font-medium">Message Permission Settings</p>
                <div className="flex justify-between gap-2 items-center w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-medium">
                            Allow messages from volunteers to reach you.
                        </p>
                        <p className="font-normal text-sm">
                            By enabling this, you agree to receive communication from volunteers.
                        </p>
                    </div>
                    <Switch
                        checked={isEnabled}
                        onChange={setIsEnabled}
                        className="w-fit [&.ant-switch-checked]:bg-black"
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
