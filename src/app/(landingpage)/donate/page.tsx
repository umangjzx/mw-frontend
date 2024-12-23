"use client";

import DonateCard from "@/components/common/DonateCard";
import React, { useState } from "react";
import { donateCardData } from "@/constants/landingPage";
import RadioInput from "@/components/common/Input/RadioButton";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Input/Select";
import Button from "@/components/common/Button";
import Accordian from "@/components/landingpage/components/Accordian";
import { CollapseProps } from "antd";

const Donate = () => {
    const [donateAmount, setDonateAmount] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [state, setState] = useState<string>("");

    const handleState = (value: string) => {
        setState(value);
    };

    const handleFirstName = (value: string) => {
        setFirstName(value);
    };

    const handleLastName = (value: string) => {
        setLastName(value);
    };

    const handleDisplayName = (value: string) => {
        setDisplayName(value);
    };

    const handleCustomAmount = (value: string) => {
        setCustomAmount(value);
    };

    const handleDonateAmount = (value: string | number) => {
        setDonateAmount(String(value));
        setIsCustom(String(value) === "custom");
    };

    const stateOptions = [
        { label: "Andhra Pradesh", value: "Andhra Pradesh" },
        { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
        { label: "Assam", value: "Assam" },
        { label: "Bihar", value: "Bihar" },
        { label: "Chhattisgarh", value: "Chhattisgarh" },
        { label: "Goa", value: "Goa" },
        { label: "Gujarat", value: "Gujarat" },
        { label: "Haryana", value: "Haryana" },
        { label: "Himachal Pradesh", value: "Himachal Pradesh" },
    ];

    const doante = {
        id: "donate",
        label: "",
        inputType: "radio",
        options: [
            { label: "$10", value: "10" },
            { label: "$20", value: "20" },
            { label: "$50", value: "50" },
            { label: "$100", value: "100" },
            { label: "Custom", value: "custom" },
        ],
        gridCols: 5,
        required: true,
    };

    const display = {
        id: "displayName",
        label: "Display Name",
        inputType: "text",
        placeholder: "Enter your display name",
        required: true,
        options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
        ],
    };

    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

    const items = [
        {
            key: "1",
            label: "Is this donation tax-deductible?",
            content:
                "Your gift is tax deductible as per your local regulations, as we are a tax exempt organization. We will email you a donation receipt. Please keep this, as it is your official record to claim this donation as a tax deduction.",
        },
        {
            key: "1",
            label: "Is this donation tax-deductible?",
            content:
                "Your gift is tax deductible as per your local regulations, as we are a tax exempt organization. We will email you a donation receipt. Please keep this, as it is your official record to claim this donation as a tax deduction.",
        },
    ];

    return (
        <div className="flex flex-col gap-10 py-[4rem] pb-[10rem] w-[80%] mx-auto">
            <div className="flex flex-col gap-4 items-center ">
                <h2 className="text-[2rem] font-medium text-center leading-normal">
                    Support Our Mission
                </h2>
                <p className="text-xl text-gray-light text-center leading-normal">
                    At Melody Wings, we strive to provide opportunities for differently-abled
                    children to learn, grow, and unlock their potential. Your support helps us
                    sustain this mission and expand our reach to more learners in need. Together, we
                    can make a lasting impact.
                </p>
            </div>
            <div className="flex flex-col gap-8 mt-10">
                <h2 className="text-[2rem] font-medium text-center leading-normal">
                    How Your Donation Helps
                </h2>
                <div className="grid grid-cols-4 h-[30%] gap-4">
                    {donateCardData.map((item, index) => (
                        <DonateCard key={index} {...item} />
                    ))}
                </div>
            </div>
            <div className="bg-white flex flex-col gap-4 rounded-2xl p-8 w-full mt-5">
                <h2 className="text-[2rem] font-medium leading-normal">Make a Difference Today</h2>
                <div className="mb-4">
                    <p className="text-xl font-medium mb-4">Donation Tiers</p>
                    <div className="flex gap-4 items-center">
                        <RadioInput
                            {...doante}
                            name="donate"
                            onChange={handleDonateAmount}
                            value={donateAmount}
                            inputType="radio"
                            radioButtonClassName="bg-white border !border-gray-200 shadow-sm py-[7px]"
                        />
                        <div className="-mb-4 w-full">
                            {/* @ts-ignore */}
                            <Input
                                name="custom"
                                value={customAmount ?? ""}
                                onChange={handleCustomAmount}
                                inputType="number"
                                inputClassName="!bg-white rounded-lg !w-[50%]"
                                placeholder="Enter your custom amount"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-2">
                            <p className="font-medium text-sm whitespace-nowrap">
                                Can we display your name?
                            </p>
                            <RadioInput
                                {...display}
                                label="Can we display your name?"
                                name="displayName"
                                // @ts-ignore
                                onChange={handleDisplayName}
                                value={displayName}
                                inputType="radio"
                                radioButtonClassName="bg-white border !border-gray-200 shadow-sm py-[7px]"
                            />
                        </div>
                        <div className="-mb-4 w-full">
                            {/* @ts-ignore */}
                            <Input
                                label="First Name"
                                name="firstName"
                                value={firstName ?? ""}
                                onChange={handleFirstName}
                                inputType="text"
                                className="w-full"
                                rootClassName="w-full"
                                inputClassName="w-full !bg-white rounded-lg"
                                placeholder="Enter your First Name"
                            />
                        </div>
                        <div className="-mb-4 w-full">
                            {/* @ts-ignore */}
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={lastName ?? ""}
                                onChange={handleLastName}
                                inputType="text"
                                className="w-full"
                                rootClassName="w-full"
                                inputClassName="w-full !bg-white rounded-lg"
                                placeholder="Enter your Last Name"
                            />
                        </div>
                        <div className="-mb-4 w-full">
                            {/* @ts-ignore */}
                            <Input
                                label="State"
                                className="w-full"
                                inputType="select"
                                name="state"
                                options={stateOptions}
                                onChange={handleState}
                                value={state}
                            />
                        </div>
                    </div>
                </div>
                <Button
                    title="Donate Now"
                    className="w-fit text-sm !bg-black hover:!bg-black rounded-lg mt-2 !text-white"
                />
            </div>
            <div className="mt-5">
                <h2 className="text-[2rem] font-medium leading-normal mb-2">
                    Frequently Asked Questions
                </h2>
                <div className="flex flex-col gap-4">
                    {items.map((item, index) => (
                        <Accordian key={index} items={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Donate;
