"use client";
import React, { useState } from "react";
import Logo from "@/components/common/Logo";
import Link from "next/link";
import Button from "@/components/common/Button";
import { IoMdClose } from "react-icons/io";
import RadioInput from "@/components/common/Input/RadioButton";
import { Radio } from "antd";
import { FaGoogle } from "react-icons/fa";
import { GoogleIcon } from "@/assets/icons";
import ModalCloseIcon from "@/assets/icons/FeedModalCloseIcon";

interface HeaderProps {
    handleModalLogin: (value: string) => void;
}

const Header = ({ handleModalLogin }: HeaderProps) => {
    const [loginAs, setLoginAs] = useState<UserType>("volunteer");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

    console.log(loginAs, "loginAs");

    const handleLoginClick = () => {
        handleModalLogin(loginAs);
    };

    const handleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
    };

    const links = [
        { title: "Our Mission", link: "/login#our-mission" },
        { title: "Blogs", link: "/blogs" },
        { title: "Donate", link: "/donate" },
        { title: "Team Up", link: "/" },
    ];

    const loginAsRadio = {
        id: "loginAs",
        name: "loginAs",
        label: "",
        inputType: "radio",
        options: [
            { label: "Volunteer", value: "volunteer" },
            { label: "Learner", value: "learner" },
        ],
        gridCols: 5,
        required: true,
    };

    const handleLoginAs = (value: UserType) => {
        setLoginAs(value);
    };

    return (
        <div className="w-full mx-auto bg-white shadow-md ">
            <div
                className={`${
                    isLoginModalOpen ? "opacity-50 visible" : "opacity-0 invisible"
                } transition-all duration-300 ease-in-out fixed top-0 left-0 w-full h-full bg-black z-30`}
            ></div>

            <div className="w-full mx-auto flex justify-between items-center 2xl:px-[4%] px-[5%] py-5 ">
                <span className="cursor-pointer">
                    <Logo />
                </span>
                <div className="flex 2xl:gap-6 gap-4 items-center">
                    <nav className="flex 2xl:gap-6 gap-4">
                        {links.map((link, index) => (
                            <Link
                                href={link.link}
                                key={index}
                                className="underline font-medium hover:text-gray-600 transition-all duration-300"
                            >
                                {link.title}
                            </Link>
                        ))}
                    </nav>
                    <div className="relative">
                        <Button
                            title="Log In"
                            className="!bg-black !px-3 !py-1 text-white hover:!bg-black hover:!text-white text-sm !rounded-lg"
                            onClick={handleLoginModal}
                        />
                        <div
                            className={`absolute right-0 bottom-[-13rem] w-[450px] py-4 px-6 h-fit flex flex-col gap-5 bg-white rounded-3xl z-40 
                                transform transition-all duration-300 ease-in-out
                                ${
                                    isLoginModalOpen
                                        ? "opacity-100 scale-100 translate-y-0 visible"
                                        : "opacity-0 scale-95 translate-y-2 invisible"
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-medium">Login As</p>
                                <div onClick={handleLoginModal} className="cursor-pointer">
                                    <ModalCloseIcon />
                                </div>
                            </div>
                            <div>
                                <LoginRadio
                                    name="loginAs"
                                    value={loginAs}
                                    // @ts-ignore
                                    onChange={handleLoginAs}
                                    options={loginAsRadio.options}
                                    inputClassName="w-full"
                                />
                            </div>
                            <Button
                                onClick={handleLoginClick}
                                title="Sign In With Google"
                                className="!bg-black w-full !px-3 !py-1 text-white hover:!bg-black hover:!text-white text-sm !rounded-xl"
                                icon={<GoogleIcon />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

const LoginRadio: React.FC<RadioInputProps> = ({
    name,
    value,
    onChange,
    disabled,
    options = [],
    inputClassName = "",
    variant = "default",
    radioButtonClassName = "",
    inputType = "radio",
}) => {
    return (
        <Radio.Group
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={inputClassName}
        >
            <div className="flex items-center gap-2 w-full h-full">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`flex  w-full rounded-xl items-center py-2 hover:bg-background-input ${
                            option.value === "learner"
                                ? value === option.value
                                    ? "bg-[#DFF5FF] border-blue-500 border hover:bg-[#DFF5FF]"
                                    : "bg-[#DFF5FF] border-[#DFF5FF] border hover:bg-[#DFF5FF]"
                                : value === option.value
                                ? "bg-[#FFE9D4] border-[#EF4107] border hover:bg-[#FFE9D4]"
                                : "bg-[#FFE9D4] border-[#FFE9D4] border hover:bg-[#FFE9D4]"
                        } px-2 py-1 rounded-lg ${radioButtonClassName}`}
                    >
                        <Radio value={option.value}>
                            <div>
                                <span>{option.label}</span>
                                {option.sublabel && (
                                    <p className="text-sm text-gray-500 ml-0">{option.sublabel}</p>
                                )}
                            </div>
                        </Radio>
                    </div>
                ))}
            </div>
        </Radio.Group>
    );
};
