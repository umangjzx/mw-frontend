import React from "react";
import LogoIcon from "@/assets/icons/LogoIcon";

const Logo = () => {
    return (
        <div className="flex items-center gap-2  rounded-lg">
            <LogoIcon />
            <h3 className="text-xl font-medium">Melody Wings</h3>
        </div>
    );
};

export default Logo;
