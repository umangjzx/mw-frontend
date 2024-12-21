import React from "react";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import Button from "@/components/common/Button";

const Header = () => {
    const links = ["Our Mission", "Blogs", "Donate", "Team Up"];
    return (
        <div className="w-full mx-auto bg-white shadow-md ">
            <div className="w-full mx-auto flex justify-between items-center 2xl:px-[9%] px-[5%] py-5 ">
                <span className="cursor-pointer">
                    <Logo />
                </span>
                <div className="flex gap-4 items-center">
                    <nav className="flex gap-4">
                        {links.map((link, index) => (
                            <Link
                                href={"/"}
                                key={index}
                                className="underline font-medium hover:text-gray-600 transition-all duration-300"
                            >
                                {link}
                            </Link>
                        ))}
                    </nav>
                    <Button
                        title="Admin Log In"
                        className="!bg-black !px-3 !py-1 text-white hover:!bg-black hover:!text-white text-sm !rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
