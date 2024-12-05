"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
interface SectionCardProps {
    href: string;
    text: string;
    icon: React.ReactNode;
    textColor?: string;
}

const SectionCard = ({ href, text, icon, textColor }: SectionCardProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    console.log(pathname, href, "isActive", isActive);

    return (
        <div className="w-full flex items-center justify-center ">
            <Link href={href} className="flex items-start gap-2 max-w-[125px] w-full ml-[-1rem]">
                <span
                    className={`text-[1.25rem] transition-all duration-300 ${
                        isActive ? "text-primary" : "text-black"
                    }   `}
                >
                    {icon}
                </span>
                <p
                    className={`text-[${textColor}] transition-all duration-300 font-medium ${
                        isActive ? "text-primary" : ""
                    }`}
                >
                    {text}
                </p>
            </Link>
        </div>
    );
};

export default SectionCard;
